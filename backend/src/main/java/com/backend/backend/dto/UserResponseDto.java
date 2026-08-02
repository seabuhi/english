package com.backend.backend.dto;

import com.backend.backend.model.User;

public class UserResponseDto {
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private boolean emailVerified;
    private int score;
    private int streak;
    private String token;

    public UserResponseDto() {}

    public static UserResponseDto fromEntity(User user, String token) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setScore(user.getScore());
        dto.setStreak(user.getStreak());
        dto.setToken(token);
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
