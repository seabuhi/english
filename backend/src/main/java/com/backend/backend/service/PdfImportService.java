package com.backend.backend.service;

import com.backend.backend.model.Category;
import com.backend.backend.model.CefrLevel;
import com.backend.backend.model.Exercise;
import com.backend.backend.model.ExerciseType;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PdfImportService {

    public List<Exercise> parsePdfToExercises(MultipartFile pdfFile, CefrLevel defaultLevel, Category defaultCategory) throws IOException {
        List<Exercise> exercises = new ArrayList<>();

        byte[] pdfBytes = pdfFile.getBytes();
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String fullText = stripper.getText(document);

            // Split into paragraphs or question chunks
            String[] lines = fullText.split("\\r?\\n");
            
            StringBuilder currentQuestion = new StringBuilder();
            String currentTitle = "PDF Exercise " + (exercises.size() + 1);
            List<String> currentOptions = new ArrayList<>();
            String currentAnswer = "";
            String currentExplanation = "";

            Pattern questionNumPattern = Pattern.compile("^(\\d+)[.\\)]\\s*(.+)");
            Pattern optionPattern = Pattern.compile("^([A-D])[.\\)]\\s*(.+)");
            Pattern answerPattern = Pattern.compile("^(Answer|Correct Answer|Ans):\\s*(.+)", Pattern.CASE_INSENSITIVE);
            Pattern explanationPattern = Pattern.compile("^(Explanation|Note):\\s*(.+)", Pattern.CASE_INSENSITIVE);

            for (String line : lines) {
                line = line.trim();
                if (line.isEmpty()) continue;

                Matcher qMatcher = questionNumPattern.matcher(line);
                Matcher optMatcher = optionPattern.matcher(line);
                Matcher ansMatcher = answerPattern.matcher(line);
                Matcher expMatcher = explanationPattern.matcher(line);

                if (qMatcher.matches()) {
                    // Flush previous exercise if exists
                    if (currentQuestion.length() > 0) {
                        exercises.add(buildExercise(
                            currentTitle,
                            defaultLevel != null ? defaultLevel : CefrLevel.B1,
                            defaultCategory != null ? defaultCategory : Category.GRAMMAR,
                            currentQuestion.toString(),
                            currentOptions,
                            currentAnswer,
                            currentExplanation
                        ));
                        currentQuestion.setLength(0);
                        currentOptions.clear();
                        currentAnswer = "";
                        currentExplanation = "";
                    }

                    currentTitle = "Question " + qMatcher.group(1);
                    currentQuestion.append(qMatcher.group(2));
                } else if (optMatcher.matches()) {
                    currentOptions.add(optMatcher.group(1) + ") " + optMatcher.group(2));
                } else if (ansMatcher.matches()) {
                    currentAnswer = ansMatcher.group(2).trim();
                } else if (expMatcher.matches()) {
                    currentExplanation = expMatcher.group(2).trim();
                } else {
                    if (currentQuestion.length() > 0) {
                        currentQuestion.append(" ").append(line);
                    } else {
                        currentQuestion.append(line);
                    }
                }
            }

            // Flush final question
            if (currentQuestion.length() > 0) {
                exercises.add(buildExercise(
                    currentTitle,
                    defaultLevel != null ? defaultLevel : CefrLevel.B1,
                    defaultCategory != null ? defaultCategory : Category.GRAMMAR,
                    currentQuestion.toString(),
                    currentOptions,
                    currentAnswer,
                    currentExplanation
                ));
            }
        }

        return exercises;
    }

    private Exercise buildExercise(String title, CefrLevel level, Category category,
                                  String question, List<String> options, String answer, String explanation) {
        Exercise ex = new Exercise();
        ex.setTitle(title);
        ex.setLevel(level);
        ex.setCategory(category);
        ex.setExerciseType(options.isEmpty() ? ExerciseType.FILL_IN_BLANK : ExerciseType.MULTIPLE_CHOICE);
        ex.setQuestionText(question);

        if (!options.isEmpty()) {
            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < options.size(); i++) {
                json.append("\"").append(options.get(i).replace("\"", "\\\"")).append("\"");
                if (i < options.size() - 1) json.append(",");
            }
            json.append("]");
            ex.setOptionsJson(json.toString());
        }

        ex.setCorrectAnswer(answer.isEmpty() && !options.isEmpty() ? options.get(0) : (answer.isEmpty() ? "Correct Answer" : answer));
        ex.setExplanation(explanation.isEmpty() ? "Standard exercise parsed from PDF document." : explanation);
        return ex;
    }
}
