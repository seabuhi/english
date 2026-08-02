package com.backend.backend.service;

import com.backend.backend.model.CefrLevel;
import com.backend.backend.model.SpeakingTopic;
import com.backend.backend.repository.SpeakingTopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SpeakingTopicService {

    @Autowired
    private SpeakingTopicRepository speakingTopicRepository;

    public List<SpeakingTopic> getAllSpeakingTopics(CefrLevel level) {
        if (level != null) {
            return speakingTopicRepository.findByLevel(level);
        }
        return speakingTopicRepository.findAll();
    }

    public Optional<SpeakingTopic> getSpeakingTopicById(Long id) {
        return speakingTopicRepository.findById(id);
    }

    public SpeakingTopic saveSpeakingTopic(SpeakingTopic topic) {
        return speakingTopicRepository.save(topic);
    }

    public void deleteSpeakingTopic(Long id) {
        speakingTopicRepository.deleteById(id);
    }
}
