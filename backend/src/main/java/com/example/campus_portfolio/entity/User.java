package com.example.campus_portfolio.entity;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username")
    private String username;

    @Column(name = "mail_address")
    private String mailAddress;

    @Column(name = "password")
    private String password;

    @Column(name = "self_introduction")
    private String selfIntroduction;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Column(name = "role")
    private String role;

    // --- いいねした作品リスト ---
    @ManyToMany
    @JoinTable(
        name = "user_likes_work",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "work_id")
    )
    private List<Work> likedWorks = new ArrayList<>();

    // ★ マイアルバムに追加した作品リストを追加
    @ManyToMany
    @JoinTable(
        name = "user_album_works", // アルバム専用の中間テーブル
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "work_id")
    )
    private List<Work> albumWorks = new ArrayList<>();
}