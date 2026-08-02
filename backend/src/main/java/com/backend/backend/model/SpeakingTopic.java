package com.backend.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "speaking_topics")
public class SpeakingTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CefrLevel level;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String promptsJson;

    @Column(columnDefinition = "TEXT")
    private String followUpQuestionsJson;

    private LocalDateTime createdAt = LocalDateTime.now();

    public SpeakingTopic() {}

    public SpeakingTopic(String title, CefrLevel level, String description, String promptsJson, String followUpQuestionsJson) {
        this.title = title;
        this.level = level;
        this.description = description;
        this.promptsJson = promptsJson;
        this.followUpQuestionsJson = followUpQuestionsJson;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public CefrLevel getLevel() { return level; }
    public void setLevel(CefrLevel level) { this.level = level; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPromptsJson() { return promptsJson; }
    public void setPromptsJson(String promptsJson) { this.promptsJson = promptsJson; }

    public String getFollowUpQuestionsJson() { return followUpQuestionsJson; }
    public void setFollowUpQuestionsJson(String followUpQuestionsJson) { this.followUpQuestionsJson = followUpQuestionsJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
