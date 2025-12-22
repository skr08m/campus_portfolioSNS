package com.example.campus_portfolio.service;

import com.example.campus_portfolio.dto.*;
import com.example.campus_portfolio.entity.*;
import com.example.campus_portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final UserFrequentTagsRepository userFrequentTagsRepository;

    // 自分の情報取得
    public UserResponse getMe(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ユーザが存在しません"));

        return toResponse(user);
    }

    // 自分の情報更新(名前、メアド、自己紹介、プロフ写真)
    public UserResponse updateMe(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ユーザが存在しません"));

        user.setUsername(request.getUsername());
        user.setMailAddress(request.getMailAddress());
        user.setSelfIntroduction(request.getSelfIntroduction());
        user.setProfilePhotoUrl(request.getProfilePhotoUrl());

        return toResponse(user); //更新後の情報をDTOにして返す
    }
    
    // 自分の情報部分更新（PATCH）
    public UserResponse patchMe(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ユーザが存在しません"));

        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getMailAddress() != null) {
            user.setMailAddress(request.getMailAddress());
        }
        if (request.getSelfIntroduction() != null) {
            user.setSelfIntroduction(request.getSelfIntroduction());
        }
        if (request.getProfilePhotoUrl() != null) {
            user.setProfilePhotoUrl(request.getProfilePhotoUrl());
        }

        userRepository.save(user);

        return toResponse(user);
    }


    // ユーザ削除（管理者）
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    // よく使うタグ取得
    public List<String> getFavoriteTags(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        return userFrequentTagsRepository.findByUser(user).stream()
                .map(uf -> uf.getTag().getTagName())
                .toList();
    }

    // よく使うタグ更新(手動設定版)（履歴から実装できるように後で修正予定）
    public void updateFavoriteTags(Long userId, List<Long> tagIds) {
        User user = userRepository.findById(userId).orElseThrow();

        // 一旦削除
        userFrequentTagsRepository.deleteAll(
                userFrequentTagsRepository.findByUser(user)
        );

        // 再登録
        for (Long tagId : tagIds) {
            Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new RuntimeException("タグが存在しません"));

            UserFrequentTags uft = new UserFrequentTags();
            uft.setUser(user);
            uft.setTag(tag);
            userFrequentTagsRepository.save(uft);
        }
    }

    // Entity → DTO変換
    private UserResponse toResponse(User user) {
        List<String> tags = getFavoriteTags(user.getUserId()); //★よく使うタグを追加しました
        return new UserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getMailAddress(),
                user.getSelfIntroduction(),
                user.getProfilePhotoUrl(),
                user.getRole(),
                "********",
                tags //★よく使うタグを追加しました
        );
    }
}

