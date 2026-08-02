package com.backend.backend.service;

import com.backend.backend.dto.*;
import com.backend.backend.model.AdminUser;
import com.backend.backend.model.User;
import com.backend.backend.repository.AdminUserRepository;
import com.backend.backend.repository.UserRepository;
import com.backend.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BrevoEmailService brevoEmailService;

    @Autowired
    private JwtUtils jwtUtils;

    private static final SecureRandom random = new SecureRandom();

    public User registerUser(UserRegisterDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username '" + dto.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email '" + dto.getEmail() + "' is already registered.");
        }

        User user = new User();
        user.setFullName(dto.getFullName());
        user.setUsername(dto.getUsername().trim().toLowerCase());
        user.setEmail(dto.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmailVerified(false);

        // Generate 6-digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(15));

        User savedUser = userRepository.save(user);

        // Send OTP email via Brevo
        brevoEmailService.sendOtpEmail(savedUser.getEmail(), savedUser.getFullName(), otp);

        return savedUser;
    }

    public boolean verifyOtp(VerifyOtpDto dto) {
        User user = userRepository.findByEmail(dto.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + dto.getEmail()));

        if (user.isEmailVerified()) {
            return true;
        }

        if (user.getOtpCode() == null || user.getOtpExpiry() == null) {
            throw new RuntimeException("No active OTP code found. Please request a new code.");
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new RuntimeException("OTP code has expired. Please request a new code.");
        }

        if (!user.getOtpCode().equals(dto.getOtpCode().trim())) {
            throw new RuntimeException("Invalid OTP code. Please check your email and try again.");
        }

        user.setEmailVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return true;
    }

    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        String newOtp = String.format("%06d", random.nextInt(1000000));
        user.setOtpCode(newOtp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        brevoEmailService.sendOtpEmail(user.getEmail(), user.getFullName(), newOtp);
    }

    public UserResponseDto loginUser(UserLoginDto dto) {
        String input = dto.getUsernameOrEmail().trim().toLowerCase();

        // Check if logging in as admin
        if ("admin".equalsIgnoreCase(input)) {
            Optional<AdminUser> adminOpt = adminUserRepository.findByUsername("admin");
            if (adminOpt.isPresent()) {
                AdminUser admin = adminOpt.get();
                if (passwordEncoder.matches(dto.getPassword(), admin.getPassword())) {
                    String token = jwtUtils.generateToken("admin");
                    UserResponseDto res = new UserResponseDto();
                    res.setId(admin.getId());
                    res.setFullName("Administrator");
                    res.setUsername("admin");
                    res.setEmail("admin@linguapro.com");
                    res.setEmailVerified(true);
                    res.setToken(token);
                    return res;
                }
            }
        }

        // Regular student login
        User user = userRepository.findByUsernameOrEmail(input, input)
                .orElseThrow(() -> new RuntimeException("Invalid username/email or password."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username/email or password.");
        }

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Your email address is not verified yet. Please verify your OTP code first.");
        }

        String token = jwtUtils.generateToken(user.getUsername());
        return UserResponseDto.fromEntity(user, token);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
