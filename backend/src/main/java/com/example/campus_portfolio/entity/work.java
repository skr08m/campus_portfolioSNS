package com.example.campus_portfolio.entity;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @Column(name = "work_data", columnDefinition = "BYTEA")
    private byte[] workData;

    @Column(name = "work_extension", length = 20)
    private String workExtension;

    @Column(name = "likes_count")
private Integer likesCount = 0;

    @ManyToMany
    @JoinTable(name = "work_tag", // 中間テーブル名
            joinColumns = @JoinColumn(name = "work_id"), // Work 側 FK
            inverseJoinColumns = @JoinColumn(name = "tag_id") // Tag 側 FK
    )
    private List<Tag> tags = new ArrayList<>();

    // 既存のコードに追加
@OneToMany(mappedBy = "work", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Comment> comments = new ArrayList<>();
}
