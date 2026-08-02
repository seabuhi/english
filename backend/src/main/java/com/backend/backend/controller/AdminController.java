package com.backend.backend.controller;

import com.backend.backend.model.Category;
import com.backend.backend.model.CefrLevel;
import com.backend.backend.model.Exercise;
import com.backend.backend.model.SpeakingTopic;
import com.backend.backend.service.ExerciseService;
import com.backend.backend.service.FileStorageService;
import com.backend.backend.service.PdfImportService;
import com.backend.backend.service.SpeakingTopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ExerciseService exerciseService;

    @Autowired
    private SpeakingTopicService speakingTopicService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private PdfImportService pdfImportService;

    // --- Exercise CRUD ---

    @GetMapping("/exercises")
    public ResponseEntity<List<Exercise>> getAllExercises(
            @RequestParam(required = false) CefrLevel level,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(exerciseService.getAllExercises(level, category, search));
    }

    @GetMapping("/exercises/{id}")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable Long id) {
        return exerciseService.getExerciseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/exercises")
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise) {
        return ResponseEntity.status(HttpStatus.CREATED).body(exerciseService.saveExercise(exercise));
    }

    @PutMapping("/exercises/{id}")
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long id, @RequestBody Exercise exerciseDetails) {
        return exerciseService.getExerciseById(id).map(existing -> {
            existing.setTitle(exerciseDetails.getTitle());
            existing.setLevel(exerciseDetails.getLevel());
            existing.setCategory(exerciseDetails.getCategory());
            existing.setExerciseType(exerciseDetails.getExerciseType());
            existing.setTextContent(exerciseDetails.getTextContent());
            existing.setAudioUrl(exerciseDetails.getAudioUrl());
            existing.setImageUrl(exerciseDetails.getImageUrl());
            existing.setTranscript(exerciseDetails.getTranscript());
            existing.setQuestionText(exerciseDetails.getQuestionText());
            existing.setOptionsJson(exerciseDetails.getOptionsJson());
            existing.setCorrectAnswer(exerciseDetails.getCorrectAnswer());
            existing.setExplanation(exerciseDetails.getExplanation());
            return ResponseEntity.ok(exerciseService.saveExercise(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/exercises/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }

    // --- Speaking Topics CRUD ---

    @GetMapping("/speaking-topics")
    public ResponseEntity<List<SpeakingTopic>> getAllSpeakingTopics(
            @RequestParam(required = false) CefrLevel level) {
        return ResponseEntity.ok(speakingTopicService.getAllSpeakingTopics(level));
    }

    @PostMapping("/speaking-topics")
    public ResponseEntity<SpeakingTopic> createSpeakingTopic(@RequestBody SpeakingTopic topic) {
        return ResponseEntity.status(HttpStatus.CREATED).body(speakingTopicService.saveSpeakingTopic(topic));
    }

    @PutMapping("/speaking-topics/{id}")
    public ResponseEntity<SpeakingTopic> updateSpeakingTopic(@PathVariable Long id, @RequestBody SpeakingTopic topicDetails) {
        return speakingTopicService.getSpeakingTopicById(id).map(existing -> {
            existing.setTitle(topicDetails.getTitle());
            existing.setLevel(topicDetails.getLevel());
            existing.setDescription(topicDetails.getDescription());
            existing.setPromptsJson(topicDetails.getPromptsJson());
            existing.setFollowUpQuestionsJson(topicDetails.getFollowUpQuestionsJson());
            return ResponseEntity.ok(speakingTopicService.saveSpeakingTopic(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/speaking-topics/{id}")
    public ResponseEntity<Void> deleteSpeakingTopic(@PathVariable Long id) {
        speakingTopicService.deleteSpeakingTopic(id);
        return ResponseEntity.noContent().build();
    }

    // --- File Storage / Media Upload ---

    @PostMapping("/files/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "audio") String type) {
        try {
            String subDir = "images".equalsIgnoreCase(type) ? "images" : "audio";
            String fileUrl = fileStorageService.storeFile(file, subDir);
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("fileName", file.getOriginalFilename());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // --- PDF Import Workflow ---

    @PostMapping("/pdf/parse")
    public ResponseEntity<List<Exercise>> parsePdf(
            @RequestParam("file") MultipartFile pdfFile,
            @RequestParam(value = "level", required = false) CefrLevel level,
            @RequestParam(value = "category", required = false) Category category) {
        try {
            List<Exercise> parsed = pdfImportService.parsePdfToExercises(pdfFile, level, category);
            return ResponseEntity.ok(parsed);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/pdf/confirm")
    public ResponseEntity<List<Exercise>> confirmBatchImport(@RequestBody List<Exercise> exercises) {
        List<Exercise> saved = exerciseService.saveAllExercises(exercises);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
