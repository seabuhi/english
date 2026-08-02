package com.backend.backend.service;

import com.backend.backend.dto.AnswerResultDto;
import com.backend.backend.dto.AnswerSubmissionDto;
import com.backend.backend.dto.ExerciseDto;
import com.backend.backend.model.Category;
import com.backend.backend.model.CefrLevel;
import com.backend.backend.model.Exercise;
import com.backend.backend.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExerciseService {

    @Autowired
    private ExerciseRepository exerciseRepository;

    public List<Exercise> getAllExercises(CefrLevel level, Category category, String search) {
        if (level != null || category != null || (search != null && !search.trim().isEmpty())) {
            return exerciseRepository.searchExercises(level, category, search != null ? search.trim() : null);
        }
        return exerciseRepository.findAll();
    }

    public List<ExerciseDto> getPublicExercises(CefrLevel level, Category category) {
        List<Exercise> exercises;
        if (level != null && category != null) {
            exercises = exerciseRepository.findByLevelAndCategory(level, category);
        } else if (level != null) {
            exercises = exerciseRepository.findByLevel(level);
        } else if (category != null) {
            exercises = exerciseRepository.findByCategory(category);
        } else {
            exercises = exerciseRepository.findAll();
        }
        return exercises.stream().map(ExerciseDto::fromEntityPublic).toList();
    }

    public Optional<Exercise> getExerciseById(Long id) {
        return exerciseRepository.findById(id);
    }

    public Optional<ExerciseDto> getPublicExerciseById(Long id) {
        return exerciseRepository.findById(id).map(ExerciseDto::fromEntityPublic);
    }

    public AnswerResultDto evaluateAnswer(Long id, AnswerSubmissionDto submission) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found with id: " + id));

        String submitted = submission != null && submission.getUserAnswer() != null ? submission.getUserAnswer().trim() : "";
        String correct = exercise.getCorrectAnswer() != null ? exercise.getCorrectAnswer().trim() : "";

        boolean isCorrect = false;
        if (!submitted.isEmpty()) {
            // Check exact match, case insensitive match, or choice key match (e.g., "A" matches "A) option")
            if (submitted.equalsIgnoreCase(correct)) {
                isCorrect = true;
            } else if (correct.contains(")") && submitted.equalsIgnoreCase(correct.split("\\)")[0].trim())) {
                isCorrect = true;
            } else if (submitted.contains(")") && correct.equalsIgnoreCase(submitted.split("\\)")[0].trim())) {
                isCorrect = true;
            } else if (correct.equalsIgnoreCase(submitted)) {
                isCorrect = true;
            }
        }

        return new AnswerResultDto(isCorrect, submitted, correct, exercise.getExplanation());
    }

    public Exercise saveExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    public List<Exercise> saveAllExercises(List<Exercise> exercises) {
        return exerciseRepository.saveAll(exercises);
    }

    public void deleteExercise(Long id) {
        exerciseRepository.deleteById(id);
    }
}
