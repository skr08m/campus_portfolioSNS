package com.example.campus_portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "work")
@Getter
@Setter
@NoArgsConstructor

public class Work {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_id")
    private Long workId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // 外部キー
    private User user;

    @Column(name = "work_name", length = 100)
    private String workName;

    @Column(name = "work_upload_time")
    private ZonedDateTime workUploadTime;

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "repository_url", length = 300)
    private String repositoryUrl;

    // DB にバイナリ保存（BYTEA）
    @Lob
    @Column(name = "work_data", columnDefinition = "BYTEA")
    private byte[] workData;

    @Column(name = "work_extension", length = 20)
    private String workExtension;
}
