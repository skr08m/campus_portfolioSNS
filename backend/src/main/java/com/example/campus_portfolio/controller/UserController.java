package com.example.campus_portfolio.controller;

import com.example.campus_portfolio.dto.*;
import com.example.campus_portfolio.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ログイン中ユーザIDを取得
    private Long getUserId(Authentication authentication) {
        return Long.valueOf(authentication.getName());
    }

    // ユーザ情報取得
    @GetMapping("/me")
    public UserResponse getMe(Authentication authentication) {
        Long userId = getUserId(authentication);
        return userService.getMe(userId);
    }

    // ユーザ情報更新
    @PutMapping("/me")
    public UserResponse updateMe(
            @RequestBody UserUpdateRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        return userService.updateMe(userId, request);
    }

    // ユーザ削除（管理者）
    @DeleteMapping("/me")
    public void deleteMe(Authentication authentication) {
        Long userId = getUserId(authentication);
        userService.deleteUser(userId);
    }

    // よく使うタグ取得
    @GetMapping("/me/favorite-tags")
    public List<String> getFavoriteTags(Authentication authentication) {
        Long userId = getUserId(authentication);
        return userService.getFavoriteTags(userId);
    }

    // よく使うタグ更新
    @PutMapping("/me/favorite-tags")
    public void updateFavoriteTags(
            @RequestBody List<Long> tagIds,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        userService.updateFavoriteTags(userId, tagIds);
    }
}
