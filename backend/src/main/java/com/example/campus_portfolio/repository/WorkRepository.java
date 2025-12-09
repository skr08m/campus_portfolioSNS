package com.example.campus_portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.campus_portfolio.entity.Work;

import java.util.*;

public interface WorkRepository extends JpaRepository<Work, Long> {
    Optional<Work> getByUserId(String userId);

    List<Work> findByTitleContaining(String keyword);

    // 投稿時間でソートし、上位n件を持ってくる関数
    @Query("SELECT w FROM Work w ORDER BY w.workUploadTime DESC")
    List<Work> findLatestWorks(org.springframework.data.domain.Pageable pageable);
}
