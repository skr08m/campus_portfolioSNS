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
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of("message", "投稿に成功しました"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("エラー", e.getMessage()));
        }
    }

    // 作品一覧情報(実データ以外)取得
    @GetMapping
    public ResponseEntity<?> getWorkInfo(@RequestParam(required = false) String keyword) {
        try {
            List<WorkInfoResponse> response = workService.getWorkInfoList(keyword);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("エラー", e.getMessage()));
        }
    }

    // 作品データ取得
    @GetMapping("/{workId}/file")
    public ResponseEntity<byte[]> getWorkFile(@PathVariable Long workId) {

        WorkFileHttpResponse res = workService.getWorkFile(workId);

        return ResponseEntity.ok()
                .contentType(res.getMediaType())
                .header(HttpHeaders.CONTENT_DISPOSITION, res.getContentDisposition())
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(res.getData());
    }

}
