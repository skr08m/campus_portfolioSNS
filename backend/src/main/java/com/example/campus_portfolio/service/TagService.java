package com.example.campus_portfolio.service;

import com.example.campus_portfolio.entity.Tag;
import com.example.campus_portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class TagService {
    
    private final TagRepository tagRepository;

    //全タグ取得
    public List<Tag> getAllTags(){
        return tagRepository.findAll();
    }
}
