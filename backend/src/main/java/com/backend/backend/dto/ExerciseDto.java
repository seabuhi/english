package com.backend.backend.dto;

import com.backend.backend.model.Category;
import com.backend.backend.model.CefrLevel;
import com.backend.backend.model.Exercise;
import com.backend.backend.model.ExerciseType;

public class ExerciseDto {
    private Long id;
    private String title;
    private CefrLevel level;
    private Category category;
    private ExerciseType exerciseType;
    private String textContent;
    private String audioUrl;
    private String imageUrl;
    private String transcript;
    private String questionText;
    private String optionsJson;

    public ExerciseDto() {}

    public static ExerciseDto fromEntityPublic(Exercise exercise) {
        ExerciseDto dto = new ExerciseDto();
        dto.setId(exercise.getId());
        dto.setTitle(exercise.getTitle());
        dto.setLevel(exercise.getLevel());
        dto.setCategory(exercise.getCategory());
        dto.setExerciseType(exercise.getExerciseType());
        dto.setTextContent(exercise.getTextContent());
        dto.setAudioUrl(exercise.getAudioUrl());
        dto.setImageUrl(exercise.getImageUrl());
        dto.setTranscript(exercise.getTranscript());
        dto.setQuestionText(exercise.getQuestionText());
        dto.setOptionsJson(exercise.getOptionsJson());
        // Notice: correctAnswer and explanation are deliberately left NULL for public view!
        return dto;
    }

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
}
