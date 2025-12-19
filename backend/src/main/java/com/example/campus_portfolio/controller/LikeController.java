package com.example.campus_portfolio.controller;

import com.example.campus_portfolio.dto.WorkInfoResponse;
import com.example.campus_portfolio.entity.Work;
import com.example.campus_portfolio.service.LikeService;
import com.example.campus_portfolio.service.WorkService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class LikeController {

    private final LikeService likeService;
    private final WorkService workService;

    // ユーザID取得（JWT）
    private Long getUserId(Authentication authentication) {
        return Long.valueOf(authentication.getName());
    }

    // 作品にいいね
    @PostMapping("/works/{workId}/likes")
    public ResponseEntity<?> likeWork(@PathVariable Long workId, Authentication auth) {
        Long userId = getUserId(auth);
        likeService.likeWork(userId, workId);
        return ResponseEntity.ok(Map.of("message", "いいねしました"));
    }

    // 作品のいいね解除
    @DeleteMapping("/works/{workId}/likes")
    public ResponseEntity<?> unlikeWork(@PathVariable Long workId, Authentication auth) {
        Long userId = getUserId(auth);
        likeService.unlikeWork(userId, workId);
        return ResponseEntity.ok(Map.of("message", "いいねを解除しました"));
    }

    // 作品のいいね数取得
    @GetMapping("/works/{workId}/likes")
    public ResponseEntity<?> getLikeCount(@PathVariable Long workId) {
        int count = likeService.getLikeCount(workId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // ユーザのいいね作品一覧（DTOに変換して返す）
    @GetMapping("/users/{userId}/likes")
    public ResponseEntity<List<WorkInfoResponse>> getLikedWorks(@PathVariable Long userId) {
        // 1. いいねした作品リスト取得
        List<Work> likedWorks = likeService.getLikedWorksByUser(userId);

        // 2. Work → WorkInfoResponse に変換
        List<WorkInfoResponse> response = likedWorks.stream()
                .map(workService::convertWorkToDTO) // publicに変更必須
                .toList();

        // 3. レスポンス返却
        return ResponseEntity.ok(response);
    }
}
