package com.example.campus_portfolio.service;

import org.springframework.stereotype.Service;

import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.repository.UserRepository;
import com.example.campus_portfolio.entity.Work;
import com.example.campus_portfolio.repository.WorkRepository;

import lombok.RequiredArgsConstructor;
import java.util.List;


@Service
@RequiredArgsConstructor
public class LikeService {

    private final UserRepository userRepository;
    private final WorkRepository workRepository;

    // 作品にいいね
    public void likeWork(Long userId, Long workId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ユーザが存在しません"));
        Work work = workRepository.findById(workId)
                .orElseThrow(() -> new RuntimeException("作品が存在しません"));

        if (!user.getLikedWorks().contains(work)) {
            user.getLikedWorks().add(work);
            userRepository.save(user);
        }
    }

    // 作品のいいね解除
    public void unlikeWork(Long userId, Long workId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ユーザが存在しません"));
        Work work = workRepository.findById(workId)
                .orElseThrow(() -> new RuntimeException("作品が存在しません"));

        if (user.getLikedWorks().contains(work)) {
            user.getLikedWorks().remove(work);
            userRepository.save(user);
        }
    }

    // 作品のいいね数取得
    public int getLikeCount(Long workId) {
        return workRepository.countLikes(workId);
    }

    // ユーザのいいね作品一覧
    public List<Work> getLikedWorksByUser(Long userId) {
        return userRepository.findLikedWorksByUserId(userId);
    }
}
