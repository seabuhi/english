package com.backend.backend.dto;

public class AnswerResultDto {
    private boolean correct;
    private String userAnswer;
    private String correctAnswer;
    private String explanation;

    public AnswerResultDto() {}

    public AnswerResultDto(boolean correct, String userAnswer, String correctAnswer, String explanation) {
        this.correct = correct;
        this.userAnswer = userAnswer;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
    }

    public boolean isCorrect() { return correct; }
    public void setCorrect(boolean correct) { this.correct = correct; }

    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
