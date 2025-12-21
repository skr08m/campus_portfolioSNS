// コメント取得用レスポンス
package com.example.campus_portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
public class CommentResponseDto {
    private Long commentId;
    private Long userId;
    private String userName;
    private String content;
    private ZonedDateTime createdAt;
}
