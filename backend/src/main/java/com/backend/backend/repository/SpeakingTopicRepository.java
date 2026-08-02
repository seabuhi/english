package com.backend.backend.repository;

import com.backend.backend.model.CefrLevel;
import com.backend.backend.model.SpeakingTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpeakingTopicRepository extends JpaRepository<SpeakingTopic, Long> {
    List<SpeakingTopic> findByLevel(CefrLevel level);
}
