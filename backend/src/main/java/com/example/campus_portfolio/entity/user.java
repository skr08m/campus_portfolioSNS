package com.example.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user")
@Getter
@Setter
public class user {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;

    @Column(name="username")
    private String username;

    @Column(name="mail_address")
    private String mail_address;

    @Column(name="password")
    private String password;

    @Column(name="self_introduction")
    private String self_introduction;

    @Column(name="profile_photo_url")
    private String profile_photo_url;

    @Column(name="role")
    private String role;
}






