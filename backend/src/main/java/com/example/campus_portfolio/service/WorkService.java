package com.example.campus_portfolio.service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors; // ★ 追加

import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional; // ★これが必要

import com.example.campus_portfolio.dto.TagResponse;
import com.example.campus_portfolio.dto.WorkCreateRequest;
import com.example.campus_portfolio.dto.WorkFileHttpResponse;
import com.example.campus_portfolio.dto.WorkInfoResponse;
import com.example.campus_portfolio.entity.Tag;
import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.entity.Work;
import com.example.campus_portfolio.repository.TagRepository;
import com.example.campus_portfolio.repository.UserRepository;
import com.example.campus_portfolio.repository.WorkRepository;
import com.example.campus_portfolio.util.FileTypeConstants;

import lombok.RequiredArgsConstructor;

import com.example.campus_portfolio.dto.CommentResponse; // 追加
import com.example.campus_portfolio.entity.Comment;     // 追加
import com.example.campus_portfolio.repository.CommentRepository; // 追加

@Service
@RequiredArgsConstructor
public class WorkService {

    private final WorkRepository workRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    // ★ 追加：マイアルバム一覧取得ロジック（MyAlbum.jsx用）
    @Transactional(readOnly = true)
    public List<WorkInfoResponse> getUserAlbum(User user) {
        // Userエンティティの albumWorks リストをDTOに変換して返す
        return user.getAlbumWorks().stream()
                .map(this::convertWorkToDTO)
                .collect(Collectors.toList());
    }

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
        
        // ★ 追加：いいね数をDTOにセット
        workResponse.setLikesCount(work.getLikesCount() == null ? 0 : work.getLikesCount());

        // ★ 投稿者名をセットする処理を追加
        if (work.getUser() != null) {
            workResponse.setUsername(work.getUser().getUsername());
        }

        // ★ 変更：コメントをDTOに変換してセット（Entityのフィールド名 content, createdAt に合わせる）
        if (work.getComments() != null) {
            List<CommentResponse> commentDTOs = work.getComments().stream()
                .map(c -> new CommentResponse(
                    c.getUser() != null ? c.getUser().getUsername() : "Unknown", 
                    c.getContent(), 
                    c.getCreatedAt()
                ))
                .toList();
            workResponse.setComments(commentDTOs);
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
    @Transactional // ★ 追加
    public Work createWork(User user, WorkCreateRequest request) throws Exception {

        Work work = new Work();
        work.setUser(user);// FKを判定するために使うので、インスタンスにuserIdだけ入っていればOK
        work.setWorkUploadTime(ZonedDateTime.now());
        work.setTitle(request.getTitle());
        work.setExplanation(request.getExplanation());
        work.setRepositoryUrl(request.getRepositoryUrl());
        work.setWorkExtension(request.getWorkExtension());
        work.setLikesCount(0); // ★ 初期値をセット

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
            works = works = workRepository.findAll();
        }

        // 2. タグが指定されている場合、Java側でフィルタリング
        if (tags != null && !tags.isEmpty()) {
            works = works.stream().filter(work -> {
                // 作品が持っているタグ名リストを作成
                List<String> workTagNames = work.getTags().stream()
                        .map(Tag::getTagName)
                        .toList();
                // 指定されたタグが「すべて」含まれているかチェック (AND検索の場合)
                return workTagNames.containsAll(tags);
            }).toList();
        }

        // 3. DTOに変換して返す
        List<WorkInfoResponse> res = new ArrayList<>();
        for (Work w : works) {
            res.add(convertWorkToDTO(w));
        }
        return res;
    }

    // IDから作品詳細を1件取得する
    public WorkInfoResponse getWorkDetailById(Long workId) {
        Work work = workRepository.findById(workId)
                .orElseThrow(() -> new RuntimeException("指定された作品IDが存在しません"));
        
        // 既存の convertWorkToDTO メソッドを使って DTO に変換して返す
        return convertWorkToDTO(work);
    }

    // ★ 変更：@Transactionalを追加し、Entityのフィールド名変更(content, createdAt)に合わせる
    @Transactional
    public void addComment(User user, Long workId, String content) {
        Work work = workRepository.findById(workId)
                .orElseThrow(() -> new RuntimeException("作品が存在しません"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setWork(work); 
        
        comment.setContent(content); // ★ 変更
        comment.setCreatedAt(ZonedDateTime.now()); // ★ 変更

        commentRepository.save(comment);
    }

    // いいね数を1増やす
    @Transactional
    public int incrementLike(Long workId) {
        Work work = workRepository.findById(workId).orElseThrow();
        work.setLikesCount((work.getLikesCount() == null ? 0 : work.getLikesCount()) + 1);
        workRepository.save(work);
        return work.getLikesCount();
    }

    // マイアルバム（お気に入り）に保存
    @Transactional
    public void addWorkToAlbum(User user, Long workId) {
        Work work = workRepository.findById(workId).orElseThrow();
        // Userエンティティ側に @ManyToMany で albumWorks を定義している場合
        if (!user.getAlbumWorks().contains(work)) {
            user.getAlbumWorks().add(work);
            userRepository.save(user);
        }
    }
}