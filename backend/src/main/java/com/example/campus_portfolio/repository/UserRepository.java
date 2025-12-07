package com.example.campus_portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.campus_portfolio.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
}
