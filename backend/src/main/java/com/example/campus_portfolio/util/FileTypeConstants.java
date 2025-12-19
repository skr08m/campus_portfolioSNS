package com.example.campus_portfolio.util;

import org.springframework.http.MediaType;

import java.util.Set;

public class FileTypeConstants {

    // 画面表示（inline）可能な拡張子
    public static final Set<String> INLINE_EXTENSIONS = Set.of(
            "png", "jpg", "jpeg", "gif", "pdf",
            "mp3", "wav", "m4a", "ogg");

    // MediaType 判定
    public static MediaType getMediaType(String extension) {
        return switch (extension) {
            case "png" -> MediaType.IMAGE_PNG;
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            case "gif" -> MediaType.IMAGE_GIF;
            case "pdf" -> MediaType.APPLICATION_PDF;
            case "mp3" -> MediaType.valueOf("audio/mpeg");
            case "wav" -> MediaType.valueOf("audio/wav");
            case "m4a" -> MediaType.valueOf("audio/mp4");
            case "ogg" -> MediaType.valueOf("audio/ogg");
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }

    private FileTypeConstants() {
    } // new禁止
}
