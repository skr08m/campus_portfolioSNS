package com.example.campus_portfolio.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.campus_portfolio.dto.WorkCreateRequest;
import com.example.campus_portfolio.dto.WorkFileHttpResponse;
import com.example.campus_portfolio.dto.WorkInfoResponse;
import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.service.AuthService;
import com.example.campus_portfolio.service.WorkService;

import lombok.RequiredArgsConstructor;

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

    // ★重要：詳細取得（/{workId}）よりも上に書く
@GetMapping("/me")
public ResponseEntity<?> getMyWorks() {
    try {
        User user = authService.getCurrentUser();
        List<WorkInfoResponse> response = workService.getMyWorks(user);
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

    // いいね取り消し
@PostMapping("/{workId}/unlike")
public ResponseEntity<Integer> removeLike(@PathVariable Long workId) {
    // Service側にデクリメント（-1）するメソッドを作成してください
    int newLikes = workService.decrementLike(workId); 
    return ResponseEntity.ok(newLikes);
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

    // マイアルバム削除を追加
    @PostMapping("/{workId}/album/remove") // 安全のためPOSTで実装します
    public ResponseEntity<?> removeFromAlbum(@PathVariable Long workId) {
        try {
            User user = authService.getCurrentUser();
            workService.removeWorkFromAlbum(user, workId); // Service側にこのメソッドが必要です
            return ResponseEntity.ok(Map.of("message", "Album removed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("エラー", e.getMessage()));
        }
    }
}