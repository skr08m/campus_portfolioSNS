package com.example.campus_portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.campus_portfolio.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 修正前: findByWorkId_WorkId
    // 修正後: Commentエンティティのフィールド名「work」の、Workエンティティのフィールド名「workId」で検索
    List<Comment> findByWork_WorkId(Long workId);
}