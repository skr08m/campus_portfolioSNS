package com.example.campus_portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.entity.Work;

public interface WorkRepository extends JpaRepository<Work, Long> {
    @Query("SELECT w FROM Work w WHERE w.user.userId = :userId")
    Optional<Work> getByUserId(@Param("userId") Long userId);

    List<Work> findByTitleContaining(String keyword);

    // 投稿時間でソートし、上位n件を持ってくる関数
    @Query("SELECT w FROM Work w ORDER BY w.workUploadTime DESC")
    List<Work> findLatestWorks(org.springframework.data.domain.Pageable pageable);

    // 作品に対するいいね数をカウント
    @Query("SELECT COUNT(u) FROM User u JOIN u.likedWorks w WHERE w.workId = :workId")
    int countLikes(@Param("workId") Long workId);

    // ★ 追加：投稿者(User)に基づいて作品一覧を取得する
    List<Work> findByUser(User user);
}
