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
    private Long comment_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_id")
    private Work work_id;

    @Column(name = "comment_content", columnDefinition = "TEXT")
    private String comment_conten;

    @Column(name = "sent_at")
    private ZonedDateTime sent_at;
}
