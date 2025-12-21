package com.example.campus_portfolio.controller;

import com.example.campus_portfolio.dto.CommentCreateRequestDto;
import com.example.campus_portfolio.dto.CommentResponseDto;
import com.example.campus_portfolio.service.CommentService;
import com.example.campus_portfolio.service.AuthService; // JWTでユーザ取得
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;
    private final AuthService authService;

    // コメント投稿
    @PostMapping("/works/{workId}/comments")
    public ResponseEntity<CommentResponseDto> postComment(
            @PathVariable Long workId,
            @RequestBody CommentCreateRequestDto request,
            Authentication authentication
    ) {
        Long userId = Long.valueOf(authentication.getName());
        CommentResponseDto response = commentService.createComment(workId, userId, request);
        return ResponseEntity.ok(response);
    }

    // コメント一覧取得
    @GetMapping("/works/{workId}/comments")
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long workId) {
        List<CommentResponseDto> response = commentService.getComments(workId);
        return ResponseEntity.ok(response);
    }

    // コメント削除
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Map<String, String>> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication
    ) {
        Long userId = Long.valueOf(authentication.getName());
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.ok(Map.of("message", "コメントを削除しました"));
    }
}
