package com.example.campus_portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private String username;
    private String content;
    private ZonedDateTime sentAt;
}