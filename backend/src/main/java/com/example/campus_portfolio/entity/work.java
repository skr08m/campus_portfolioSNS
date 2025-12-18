package com.example.campus_portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "work_upload_time")
    private ZonedDateTime workUploadTime;

    @Column(name = "explanation", columnDefinition = "TEXT", nullable = true)
    private String explanation;

    @Column(name = "repository_url", length = 300, nullable = true)
    private String repositoryUrl;

    // DB にバイナリ保存（BYTEA）
    @Lob
    @Column(name = "work_data", columnDefinition = "BYTEA")
    private byte[] workData;

    @Column(name = "work_extension", length = 20)
    private String workExtension;

    @ManyToMany
    @JoinTable(name = "work_tag", // 中間テーブル名
            joinColumns = @JoinColumn(name = "work_id"), // Work 側 FK
            inverseJoinColumns = @JoinColumn(name = "tag_id") // Tag 側 FK
    )
    private List<Tag> tags = new ArrayList<>();
}
