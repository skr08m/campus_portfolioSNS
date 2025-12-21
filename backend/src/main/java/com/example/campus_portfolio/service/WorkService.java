package com.example.campus_portfolio.service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.campus_portfolio.dto.TagResponse;
import com.example.campus_portfolio.dto.WorkCreateRequest;
import com.example.campus_portfolio.dto.WorkFileHttpResponse;
import com.example.campus_portfolio.dto.WorkInfoResponse;
import com.example.campus_portfolio.entity.Tag;
import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.entity.Work;
import com.example.campus_portfolio.repository.TagRepository;
import com.example.campus_portfolio.repository.WorkRepository;
import com.example.campus_portfolio.util.FileTypeConstants;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkService {

    private final WorkRepository workRepository;
    private final TagRepository tagRepository;

    // 作品一覧取得（オプションでタイトル検索）
    public List<WorkInfoResponse> getWorkInfoList(String keyword) {
        List<Work> responseWorkList = new ArrayList<>();

        // 検索ワード指定の有無で分岐
        if (keyword == null || keyword.isBlank()) {
            responseWorkList = workRepository.findAll();
        } else {
            responseWorkList = workRepository.findByTitleContaining(keyword);
        }

        // 返り値のList生成
        List<WorkInfoResponse> res = new ArrayList<>();
        for (Work w : responseWorkList) {
            res.add(convertWorkToDTO(w));
        }
        return res;
    }

    // Work→WorkResponseに変換
    public WorkInfoResponse convertWorkToDTO(Work work) { //LikeControllerから呼べるようにpublicに変更しました
        WorkInfoResponse workResponse = new WorkInfoResponse();

        workResponse.setId(work.getWorkId());
        workResponse.setTitle(work.getTitle());
        workResponse.setExplanation(work.getExplanation());
        workResponse.setRepositoryUrl(work.getRepositoryUrl());
        workResponse.setWorkUploadTime(String.valueOf(work.getWorkUploadTime()));
        workResponse.setWorkExtension(work.getWorkExtension());

        // ★ 投稿者名をセットする処理を追加
    if (work.getUser() != null) {
        workResponse.setUsername(work.getUser().getUsername());
    }

        // tagの追加
        List<TagResponse> tags = new ArrayList<>();
        for (Tag w : work.getTags()) {
            tags.add(new TagResponse(w.getTagId(), w.getTagName()));
        }
        workResponse.setTags(tags);
        return workResponse;
    }

    // 作品データ取得
    public WorkFileHttpResponse getWorkFile(Long workId) {
        Work work = workRepository.findById(workId)
                .orElseThrow(() -> new IllegalArgumentException("作品が存在しません"));

        String ext = work.getWorkExtension().toLowerCase();

        MediaType mediaType = FileTypeConstants.getMediaType(ext);

        boolean inline = FileTypeConstants.INLINE_EXTENSIONS.contains(ext);

        String fullFileName = work.getTitle() + "." + ext;
        String disposition = ContentDisposition
                .builder(inline ? "inline" : "attachment")
                .filename(fullFileName, java.nio.charset.StandardCharsets.UTF_8)
                .build()
                .toString();

        return new WorkFileHttpResponse(
                work.getWorkData(),
                mediaType,
                disposition);
    }

    // 作品の説明を取得
    public String getWorkExplanation(Long workId) {
        return workRepository.findById(workId)
                .map(Work::getExplanation)
                .orElseThrow(() -> new RuntimeException("作品が存在しません"));
    }

    // 作品投稿
    public Work createWork(User user, WorkCreateRequest request) throws Exception {

        Work work = new Work();
        work.setUser(user);// FKを判定するために使うので、インスタンスにuserIdだけ入っていればOK
        work.setWorkUploadTime(ZonedDateTime.now());
        work.setTitle(request.getTitle());
        work.setExplanation(request.getExplanation());
        work.setRepositoryUrl(request.getRepositoryUrl());
        work.setWorkExtension(request.getWorkExtension());

        // データ取り出し
        MultipartFile file = request.getWorkData();
        if (file != null && !file.isEmpty()) {
            work.setWorkData(file.getBytes());
        }

        // タグ処理
        if (request.getTags() == null || request.getTags().size() <= 0) {
            return workRepository.save(work);
        }

        for (String tagName : request.getTags()) {
            Tag tag = tagRepository.findByTagName(tagName);
            if (tag == null) {
                System.out.println("nullによりタグ登録スキップ");
                continue;
            }
            work.getTags().add(tag); // @ManyToMany で自動的に中間テーブルに反映
        }
        return workRepository.save(work);
    }

    // 作品検索ロジック (キーワード + タグ絞り込み)
    public List<WorkInfoResponse> searchWorks(String keyword, List<String> tags) {
        // 1. まず全件取得、またはキーワードで絞り込み
        List<Work> works;
        if (keyword != null && !keyword.isBlank()) {
            works = workRepository.findByTitleContaining(keyword);
        } else {
            works = workRepository.findAll();
        }

        // 2. タグが指定されている場合、Java側でフィルタリング
        // (JPAリポジトリを拡張してDB側でフィルタリングすることも可能ですが、
        //  まずは確実に動くこの方法を提案します)
        if (tags != null && !tags.isEmpty()) {
            works = works.stream().filter(work -> {
                // 作品が持っているタグ名リストを作成
                List<String> workTagNames = work.getTags().stream()
                        .map(Tag::getTagName)
                        .toList();
                // 指定されたタグが「すべて」含まれているかチェック (AND検索の場合)
                return workTagNames.containsAll(tags);
                
                // もし「どれか1つでも含まれていればOK (OR検索)」にするなら以下を使います
                // return tags.stream().anyMatch(workTagNames::contains);
            }).toList();
        }

        // 3. DTOに変換して返す
        List<WorkInfoResponse> res = new ArrayList<>();
        for (Work w : works) {
            res.add(convertWorkToDTO(w));
        }
        return res;
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
