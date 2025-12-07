package com.example.campus_portfolio.controller;

import com.example.campus_portfolio.dto.TagResponse;
import com.example.campus_portfolio.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor

public class TagController {
    
    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagResponse>> getAllTags(){
        List<TagResponse> tags = tagService.getAllTags();
        return ResponseEntity.ok(tags);
    }
}
