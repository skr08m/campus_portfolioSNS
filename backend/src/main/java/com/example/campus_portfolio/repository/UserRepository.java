package com.example.campus_portfolio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.entity.Work;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(Long userId);  // user_idで検索するメゾッド
    Optional<User> findByMailAddress(String mailAddress);  // メールアドレスでも検索可能

    //クエリを追加しました
    @Query("SELECT u.likedWorks FROM User u WHERE u.userId = :userId")
    List<Work> findLikedWorksByUserId(@Param("userId") Long userId);
}
