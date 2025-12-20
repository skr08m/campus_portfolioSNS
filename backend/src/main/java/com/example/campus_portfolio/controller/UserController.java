package com.example.campus_portfolio.controller;

import com.example.campus_portfolio.dto.*;
import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.service.AuthService;
import com.example.campus_portfolio.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService; // ← 追加

    // ユーザ情報取得
    @GetMapping("/me")
    public UserResponse getMe() {
        User currentUser = authService.getCurrentUser();
        return userService.getMe(currentUser.getUserId());
    }

    // ユーザ情報更新
    @PutMapping("/me")
    public UserResponse updateMe(@RequestBody UserUpdateRequest request) {
        User currentUser = authService.getCurrentUser();
        return userService.updateMe(currentUser.getUserId(), request);
    }

    // 部分更新（PATCH）
    @PatchMapping("/me")
    public UserResponse patchMe(@RequestBody UserUpdateRequest request) {
        User currentUser = authService.getCurrentUser();
        return userService.patchMe(currentUser.getUserId(), request);
    }

    // ユーザ削除
    //メッセージを返すように修正しました(2025.12.21.AM4:03)
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMe(Authentication authentication) {
        User currentUser = authService.getCurrentUser();
        userService.deleteUser(currentUser.getUserId());
        return ResponseEntity.ok(Map.of("message", "ユーザを削除しました"));
    }

    // よく使うタグ取得
    @GetMapping("/me/favorite-tags")
    public List<String> getFavoriteTags() {
        User currentUser = authService.getCurrentUser();
        return userService.getFavoriteTags(currentUser.getUserId());
    }

    // よく使うタグ更新
    @PutMapping("/me/favorite-tags")
    public void updateFavoriteTags(@RequestBody List<Long> tagIds) {
        User currentUser = authService.getCurrentUser();
        userService.updateFavoriteTags(currentUser.getUserId(), tagIds);
    }
}
