package com.example.campus_portfolio.entity;

import java.time.ZonedDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="comment")

public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_id")
    private Work workId;

    @Column(name = "comment_content", columnDefinition = "TEXT")
    private String commentContent;

    @Column(name = "sent_at")
    private ZonedDateTime sentAt;
}
