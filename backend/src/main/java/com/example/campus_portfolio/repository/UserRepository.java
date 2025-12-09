package com.example.campus_portfolio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.campus_portfolio.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
<<<<<<< HEAD
    Optional<User> findByEmail(String email);
=======
    Optional<User> findByUserId(Long userId);  // user_idで検索するメゾッド
    Optional<User> findByMailAddress(String mailAddress);  // メールアドレスでも検索可能
>>>>>>> 2ce612d (userテーブルアクセス用のコード)
}
