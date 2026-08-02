package com.backend.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CefrLevel level;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExerciseType exerciseType;

    @Column(columnDefinition = "TEXT")
    private String textContent;

    private String audioUrl;
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String transcript;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String optionsJson;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String correctAnswer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Exercise() {}

    public Exercise(String title, CefrLevel level, Category category, ExerciseType exerciseType,
                    String textContent, String audioUrl, String imageUrl, String transcript,
                    String questionText, String optionsJson, String correctAnswer, String explanation) {
        this.title = title;
        this.level = level;
        this.category = category;
        this.exerciseType = exerciseType;
        this.textContent = textContent;
        this.audioUrl = audioUrl;
        this.imageUrl = imageUrl;
        this.transcript = transcript;
        this.questionText = questionText;
        this.optionsJson = optionsJson;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public CefrLevel getLevel() { return level; }
    public void setLevel(CefrLevel level) { this.level = level; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public ExerciseType getExerciseType() { return exerciseType; }
    public void setExerciseType(ExerciseType exerciseType) { this.exerciseType = exerciseType; }

    public String getTextContent() { return textContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getTranscript() { return transcript; }
    public void setTranscript(String transcript) { this.transcript = transcript; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getOptionsJson() { return optionsJson; }
    public void setOptionsJson(String optionsJson) { this.optionsJson = optionsJson; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
