package com.example.campus_portfolio.repository;

import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.entity.User_frequent_tags;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// ユーザの頻出タグ（User_frequent_tags）を操作するリポジトリ
public interface UserFrequentTagsRepository extends JpaRepository<User_frequent_tags, Long> {
    List<User_frequent_tags> findByUserId(User user); // あるユーザの全頻出タグを取得
    void deleteByUserId(User user); // あるユーザの頻出タグを一括削除
}
