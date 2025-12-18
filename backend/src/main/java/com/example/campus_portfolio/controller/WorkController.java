package com.example.campus_portfolio.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.campus_portfolio.dto.WorkCreateRequest;
import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.service.AuthService;
import com.example.campus_portfolio.service.WorkService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/works")
@RequiredArgsConstructor

public class WorkController {

    private final WorkService workService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<?> postWork(@RequestBody WorkCreateRequest workCreateRequest) {
        try {
            User user = authService.getCurrentUser();
            workService.createWork(user, workCreateRequest);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of("message", "投稿に成功しました"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("エラー", e.getMessage()));
        }
    }
}
