package com.example.campus_portfolio.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkInfoResponse {
    private Long id;
    private String title;
    private String explanation;
    private String repositoryUrl;
    private String workUploadTime;
    private String workExtension;
    private List<TagResponse> tags;
}
