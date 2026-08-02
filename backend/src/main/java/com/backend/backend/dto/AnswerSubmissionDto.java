package com.backend.backend.dto;

public class AnswerSubmissionDto {
    private String userAnswer;

    public AnswerSubmissionDto() {}
    public AnswerSubmissionDto(String userAnswer) { this.userAnswer = userAnswer; }

    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }
}
