package com.example.campus_portfolio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.campus_portfolio.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(Long userId);  // user_idで検索するメゾッド
    Optional<User> findByMailAddress(String mailAddress);  // メールアドレスでも検索可能
}
