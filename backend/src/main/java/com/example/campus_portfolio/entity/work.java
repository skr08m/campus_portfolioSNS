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
    @JoinColumn(name = "user_id")  // 外部キー
    private User userId;

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

    @Column(name = "work_storage_url", length = 300)
    private String workStorageUrl;

    @Column(name = "work_extension", length = 20)
    private String workExtension;
}
