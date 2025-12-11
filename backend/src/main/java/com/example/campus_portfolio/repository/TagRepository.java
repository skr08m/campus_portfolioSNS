package com.example.campus_portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.campus_portfolio.entity.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    // 例えば名前で検索したい場合
    Tag findByTagName(String Tagname);
}