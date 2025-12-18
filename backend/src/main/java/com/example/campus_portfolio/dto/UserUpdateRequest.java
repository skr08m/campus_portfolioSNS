package com.example.campus_portfolio.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class UserUpdateRequest {
    private String username; //名前
    private String MailAddress; //メアド
    private String selfIntroduction; //自己紹介
    private String profilePhotoUrl; //プロフィール
}
