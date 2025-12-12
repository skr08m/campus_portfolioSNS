package com.example.campus_portfolio.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class WorkCreateRequest {
    private String title;
    private String explanation = null;
    private String repositoryUrl = null;
    private MultipartFile workData;
    private String workExtension;
    private String[] tags;
}
