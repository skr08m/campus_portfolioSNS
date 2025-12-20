package com.example.campus_portfolio.dto;

import org.springframework.http.MediaType;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class WorkFileHttpResponse {
    private byte[] data;
    private MediaType mediaType;
    private String contentDisposition;
}
