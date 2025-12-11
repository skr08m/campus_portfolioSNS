package com.example.campus_portfolio.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor 

public class UserResponse {
    private Long userId; //ユーザーIDを返す
    private String username; //名前
    private String MailAddress; //メアド
    private String selfIntroduction; //自己紹介
    private String profilePhotoUrl; //プロフィール
    private String role; //ロール
    private String passwordPlaceholder; //パスワード（ただしサービス層ではダミー文字列で返す予定）
}
