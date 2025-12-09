package com.example.campus_portfolio.repository;

import com.example.campus_portfolio.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {

    // 修正版：エンティティのフィールド名に合わせてメソッド名を変更
    // findByName → findByTagName
    Optional<Tag> findByTagName(String tagName);
}
