// package com.example.campus_portfolio.entity;

// import jakarta.persistence.*;
// import lombok.*;

// @Entity
// @Table(name = "User_likes_work")
// @Getter
// @Setter
// @NoArgsConstructor
// public class UserLikesWork {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "user_likes_work_id") // カラム名を明示
//     private Long userLikesWorkId;

//     @ManyToOne
//     @JoinColumn(name = "user_id") // 外部キー
//     private User user;

//     @ManyToOne
//     @JoinColumn(name = "works_id") // 外部キー
//     private Work work;
// }
