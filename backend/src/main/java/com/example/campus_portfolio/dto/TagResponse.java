package com.example.campus_portfolio.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TagResponse {
    private Long tagId;
    private String tagName;

    public TagResponse() {
    }

    public TagResponse(Long tagId, String tagName) {
        this.tagId = tagId;
        this.tagName = tagName;
    }
}
