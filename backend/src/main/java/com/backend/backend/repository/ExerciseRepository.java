package com.backend.backend.repository;

import com.backend.backend.model.Category;
import com.backend.backend.model.CefrLevel;
import com.backend.backend.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    List<Exercise> findByLevel(CefrLevel level);

    List<Exercise> findByCategory(Category category);

    List<Exercise> findByLevelAndCategory(CefrLevel level, Category category);

    @Query("SELECT e FROM Exercise e WHERE " +
           "(:level IS NULL OR e.level = :level) AND " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.questionText) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Exercise> searchExercises(@Param("level") CefrLevel level,
                                  @Param("category") Category category,
                                  @Param("search") String search);
}
