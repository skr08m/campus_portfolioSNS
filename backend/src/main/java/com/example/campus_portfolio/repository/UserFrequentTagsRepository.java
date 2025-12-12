package com.example.campus_portfolio.repository;

import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.entity.UserFrequentTags;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// ユーザの頻出タグ（User_frequent_tags）を操作するリポジトリ
public interface UserFrequentTagsRepository extends JpaRepository<UserFrequentTags, Long> {
    List<UserFrequentTags> findByUser(User user); // あるユーザの全頻出タグを取得
}