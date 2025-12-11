package com.example.campus_portfolio.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.campus_portfolio.entity.Work;
import com.example.campus_portfolio.repository.WorkRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkService {

    private final WorkRepository workRepository;

    // 作品一覧取得（オプションでタイトル検索）
    public List<Work> listWorks(String keyword) {
        if (keyword == null || keyword.isEmpty()) {
            return workRepository.findAll();
        }
        List<Work> responseList = workRepository.findByTitleContaining(keyword);
        return responseList;
    }

    // 作品の説明を取得
    public String getWorkExplanation(Long workId) {
        return workRepository.findById(workId)
                .map(Work::getExplanation)
                .orElseThrow(() -> new RuntimeException("作品が存在しません"));
    }

    // // 作品更新（投稿者または管理者のみ）
    // public Work updateWork(Long workId, Work update, String id, boolean isAdmin)
    // {
    // Work dbWork = workRepository.findById(workId)
    // .orElseThrow(() -> new RuntimeException("作品が存在しません"));

    // // 権限チェック
    // if (!dbWork.getUserId().equals(id) && !isAdmin) {
    // throw new RuntimeException("権限がありません");
    // }

    // // 3. nullでないフィールドのみ上書き
    // if (update.getWorkName() != null)
    // dbWork.setWorkName(update.getWorkName());
    // if (update.getTitle() != null)
    // dbWork.setTitle(update.getTitle());
    // if (update.getExplanation() != null)
    // dbWork.setExplanation(update.getExplanation());
    // if (update.getRepositoryUrl() != null)
    // dbWork.setRepositoryUrl(update.getRepositoryUrl());
    // if (update.getWorkStorageUrl() != null)
    // dbWork.setWorkStorageUrl();// TODO
    // if (update.getWorkExtension() != null)
    // dbWork.setWorkExtension(update.getWorkExtension());
    // if (update.getWorkUploadTime() != null)
    // dbWork.setWorkUploadTime(update.getWorkUploadTime());

    // // 更新処理
    // if (update.getTitle() != null) {
    // dbWork.setTitle(update.getTitle());
    // }
    // if (update.getExplanation() != null) {
    // dbWork.setExplanation(update.getExplanation());
    // }
    // dbwork.setWorkUploadTime(LocalDateTime.now());

    // return workRepository.save(work);
    // }

    // // 作品削除（投稿者または管理者のみ）
    // public void deleteWork(Long workId, String userEmail, boolean isAdmin) {
    // workRepository.findById(workId).ifPresentOrElse(work -> {
    // if (work.getAuthorEmail().equals(userEmail) || isAdmin) {
    // workRepository.delete(work);
    // } else {
    // throw new RuntimeException("権限がありません");
    // }
    // }, () -> {
    // throw new RuntimeException("作品が存在しません");
    // });
    // }
}
