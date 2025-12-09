package com.example.campus_portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="user_frequent_tags")

public class User_frequent_tags {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "frequent_tag_id")
    private Long frequentTagId;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    private Tag tagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User userId;   
}
