package com.backend.backend.controller;

import com.backend.backend.dto.AuthRequestDto;
import com.backend.backend.dto.AuthResponseDto;
import com.backend.backend.model.AdminUser;
import com.backend.backend.repository.AdminUserRepository;
import com.backend.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDto request) {
        Optional<AdminUser> userOpt = adminUserRepository.findByUsername(request.getUsername());

        if (userOpt.isPresent()) {
            AdminUser user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = jwtUtils.generateToken(user.getUsername());
                return ResponseEntity.ok(new AuthResponseDto(token, user.getUsername(), user.getRole()));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }
}
