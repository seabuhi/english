package com.backend.backend.controller;

import com.backend.backend.dto.AnswerResultDto;
import com.backend.backend.dto.AnswerSubmissionDto;
import com.backend.backend.dto.ExerciseDto;
import com.backend.backend.model.Category;
import com.backend.backend.model.CefrLevel;
import com.backend.backend.model.SpeakingTopic;
import com.backend.backend.service.ExerciseService;
import com.backend.backend.service.SpeakingTopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    @Autowired
    private SpeakingTopicService speakingTopicService;

    @GetMapping("/exercises")
    public ResponseEntity<List<ExerciseDto>> getExercises(
            @RequestParam(required = false) CefrLevel level,
            @RequestParam(required = false) Category category) {
        return ResponseEntity.ok(exerciseService.getPublicExercises(level, category));
    }

    @GetMapping("/exercises/{id}")
    public ResponseEntity<ExerciseDto> getExerciseById(@PathVariable Long id) {
        return exerciseService.getPublicExerciseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/exercises/{id}/submit")
    public ResponseEntity<AnswerResultDto> submitAnswer(
            @PathVariable Long id,
            @RequestBody AnswerSubmissionDto submission) {
        return ResponseEntity.ok(exerciseService.evaluateAnswer(id, submission));
    }

    @GetMapping("/speaking-topics")
    public ResponseEntity<List<SpeakingTopic>> getSpeakingTopics(
            @RequestParam(required = false) CefrLevel level) {
        return ResponseEntity.ok(speakingTopicService.getAllSpeakingTopics(level));
    }

    @GetMapping("/speaking-topics/{id}")
    public ResponseEntity<SpeakingTopic> getSpeakingTopicById(@PathVariable Long id) {
        return speakingTopicService.getSpeakingTopicById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
