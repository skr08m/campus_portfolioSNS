package com.example.campus_portfolio.repository;

import com.example.campus_portfolio.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    
    // 例えば名前で検索したい場合
    Tag findByTagName(String Tagname);
}
