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
    private String username;
    private Integer likesCount; // ★ これにより setLikesCount(...) が生成されます
    private List<Long> fileIds;
    private List<CommentResponse> comments; // コメント表示用のDTOリスト
    private List<TagResponse> tags;
}
