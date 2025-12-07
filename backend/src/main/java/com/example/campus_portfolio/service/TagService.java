package com.example.campus_portfolio.service;

import com.example.campus_portfolio.dto.TagResponse;
import com.example.campus_portfolio.entity.Tag;
import com.example.campus_portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class TagService {
    
    private final TagRepository tagRepository;

    //全タグ取得(DTOに変換)
    public List<TagResponse> getAllTags(){
        List<Tag> tags = tagRepository.findAll();
        return tags.stream().map(tag-> new TagResponse(tag.getTag_id(), tag.getTag_name())).toList();
    }
}
