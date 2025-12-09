package com.example.campus_portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long userId;

    @Column(name="username")
    private String username;

    @Column(name="mail_address")
    private String mailAddress;

    @Column(name="password")
    private String password;

    @Column(name="self_introduction")
    private String selfIntroduction;

    @Column(name="profile_photo_url")
    private String profilePhotoUrl;

    @Column(name="role")
    private String role;
}






