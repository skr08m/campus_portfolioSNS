package com.example.campus_portfolio.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.campus_portfolio.dto.WorkCreateRequest;
import com.example.campus_portfolio.dto.WorkFileHttpResponse;
import com.example.campus_portfolio.dto.WorkInfoResponse;
import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.service.AuthService;
import com.example.campus_portfolio.service.WorkService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/works")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class WorkController {

    private final WorkService workService;
    private final AuthService authService;

    // 作品投稿
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postWork(@ModelAttribute WorkCreateRequest workCreateRequest) {
        try {
            User user = authService.getCurrentUser();
            workService.createWork(user, workCreateRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "投稿に成功しました"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("エラー", e.getMessage()));
        }
    }

    // 作品一覧情報取得
    @GetMapping
    public ResponseEntity<?> getWorkInfo(@RequestParam(required = false) String keyword) {
        try {
            List<WorkInfoResponse> response = workService.getWorkInfoList(keyword);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("エラー", e.getMessage()));
        }
    }

    // 作品検索 API
    @GetMapping("/search")
    public ResponseEntity<?> searchWorks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<String> tags) {
        try {
            List<WorkInfoResponse> response = workService.searchWorks(keyword, tags);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("エラー", e.getMessage()));
        }
    }

    // ★ 修正ポイント: マイアルバム一覧取得を詳細表示より上に配置
    @GetMapping("/album")
    public ResponseEntity<?> getMyAlbum() {
        try {
            User user = authService.getCurrentUser();
            List<WorkInfoResponse> response = workService.getUserAlbum(user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("エラー", e.getMessage()));
        }
    }

    // 作品データ(画像等)取得
    @GetMapping("/{workId}/file")
    public ResponseEntity<byte[]> getWorkFile(@PathVariable Long workId) {
        WorkFileHttpResponse res = workService.getWorkFile(workId);
        return ResponseEntity.ok()
                .contentType(res.getMediaType())
                .header(HttpHeaders.CONTENT_DISPOSITION, res.getContentDisposition())
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(res.getData());
    }

    // 作品詳細情報取得 API
    @GetMapping("/{workId}")
    public ResponseEntity<?> getWorkDetail(@PathVariable Long workId) {
        try {
            WorkInfoResponse response = workService.getWorkDetailById(workId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("エラー", "作品が見つかりませんでした: " + e.getMessage()));
        }
    }

    // コメント投稿 API
    @PostMapping("/{workId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long workId,
            @RequestBody Map<String, String> requestBody) {
        try {
            User user = authService.getCurrentUser();
            String content = requestBody.get("content");
            workService.addComment(user, workId, content);
            return ResponseEntity.ok(Map.of("message", "コメントを投稿しました"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("エラー", e.getMessage()));
        }
    }

    // いいね更新
    @PostMapping("/{workId}/like")
    public ResponseEntity<Integer> addLike(@PathVariable Long workId) {
        int newLikes = workService.incrementLike(workId);
        return ResponseEntity.ok(newLikes);
    }

    // マイアルバム登録
    @PostMapping("/{workId}/album")
    public ResponseEntity<?> addToAlbum(@PathVariable Long workId) {
        User user = authService.getCurrentUser();
        workService.addWorkToAlbum(user, workId);
        return ResponseEntity.ok(Map.of("message", "Album added"));
    }
}