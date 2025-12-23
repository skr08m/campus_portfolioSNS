package com.example.campus_portfolio.service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.campus_portfolio.dto.CommentResponse;
import com.example.campus_portfolio.dto.TagResponse;
import com.example.campus_portfolio.dto.WorkCreateRequest;
import com.example.campus_portfolio.dto.WorkFileHttpResponse;
import com.example.campus_portfolio.dto.WorkInfoResponse;
import com.example.campus_portfolio.entity.Comment;
import com.example.campus_portfolio.entity.Tag;
import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.entity.Work;
import com.example.campus_portfolio.repository.CommentRepository;
import com.example.campus_portfolio.repository.TagRepository;
import com.example.campus_portfolio.repository.UserRepository;
import com.example.campus_portfolio.repository.WorkRepository;
import com.example.campus_portfolio.util.FileTypeConstants;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkService {

    private final WorkRepository workRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    /**
     * マイアルバム一覧取得ロジック
     */
    @Transactional(readOnly = true)
    public List<WorkInfoResponse> getUserAlbum(User user) {
        return user.getAlbumWorks().stream()
                .map(this::convertWorkToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 過去作品（自分の投稿一覧）取得ロジック
     */
    @Transactional(readOnly = true)
    public List<WorkInfoResponse> getMyWorks(User user) {
        List<Work> myWorks = workRepository.findByUser(user);
        return myWorks.stream()
                .map(this::convertWorkToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 作品一覧取得（オプションでタイトル検索）
     */
    public List<WorkInfoResponse> getWorkInfoList(String keyword) {
        List<Work> responseWorkList;
        if (keyword == null || keyword.isBlank()) {
            responseWorkList = workRepository.findAll();
        } else {
            responseWorkList = workRepository.findByTitleContaining(keyword);
        }
        return responseWorkList.stream().map(this::convertWorkToDTO).collect(Collectors.toList());
    }

    /**
     * WorkエンティティをWorkInfoResponse DTOに変換
     */
    public WorkInfoResponse convertWorkToDTO(Work work) {
        WorkInfoResponse workResponse = new WorkInfoResponse();
        workResponse.setId(work.getWorkId());
        workResponse.setTitle(work.getTitle());
        workResponse.setExplanation(work.getExplanation()); // getExplanationを使用
        workResponse.setRepositoryUrl(work.getRepositoryUrl());
        workResponse.setWorkUploadTime(String.valueOf(work.getWorkUploadTime()));
        workResponse.setWorkExtension(work.getWorkExtension());
        
        // いいね数をDTOにセット
        workResponse.setLikesCount(work.getLikesCount() == null ? 0 : work.getLikesCount());

        // 投稿者名をセット
        if (work.getUser() != null) {
            workResponse.setUsername(work.getUser().getUsername());
        }

        // コメントをDTOにセット
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

        // タグの変換
        List<TagResponse> tags = new ArrayList<>();
        if (work.getTags() != null) {
            for (Tag t : work.getTags()) {
                tags.add(new TagResponse(t.getTagId(), t.getTagName()));
            }
        }
        workResponse.setTags(tags);
        return workResponse;
    }

    /**
     * 作品データ取得
     */
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

        return new WorkFileHttpResponse(work.getWorkData(), mediaType, disposition);
    }

    /**
     * 作品の新規投稿
     */
    @Transactional
    public Work createWork(User user, WorkCreateRequest request) throws Exception {
        Work work = new Work();
        work.setUser(user);
        work.setWorkUploadTime(ZonedDateTime.now());
        work.setTitle(request.getTitle());
        work.setExplanation(request.getExplanation());
        work.setRepositoryUrl(request.getRepositoryUrl());
        work.setWorkExtension(request.getWorkExtension());
        work.setLikesCount(0);

        MultipartFile file = request.getWorkData();
        if (file != null && !file.isEmpty()) {
            work.setWorkData(file.getBytes());
        }

        if (request.getTags() != null && !request.getTags().isEmpty()) {
            for (String tagName : request.getTags()) {
                Tag tag = tagRepository.findByTagName(tagName);
                if (tag != null) {
                    work.getTags().add(tag);
                }
            }
        }
        return workRepository.save(work);
    }

    /**
     * 作品検索ロジック (キーワード ＋ カテゴリー)
     */
    public List<WorkInfoResponse> searchWorks(String keyword, List<String> tags) {
        // 1. まずキーワードで絞り込む（キーワードが空なら全件）
        List<Work> works = (keyword != null && !keyword.isBlank()) 
            ? workRepository.findByTitleContaining(keyword) : workRepository.findAll();

        // 2. タグ指定がある場合、さらにフィルタリング
        if (tags != null && !tags.isEmpty()) {
            works = works.stream().filter(work -> {
                List<String> workTagNames = work.getTags().stream()
                        .map(Tag::getTagName)
                        .toList();
                // 選択されたタグのいずれか1つでも含まれていればヒット（OR検索）
                // 全てを含ませたい場合は .containsAll(tags) に戻してください
                return tags.stream().anyMatch(workTagNames::contains);
            }).collect(Collectors.toList());
        }
        return works.stream().map(this::convertWorkToDTO).collect(Collectors.toList());
    }

    /**
     * 作品詳細情報取得
     */
    public WorkInfoResponse getWorkDetailById(Long workId) {
        Work work = workRepository.findById(workId)
                .orElseThrow(() -> new RuntimeException("指定された作品IDが存在しません"));
        return convertWorkToDTO(work);
    }

    /**
     * コメント追加
     */
    @Transactional
    public void addComment(User user, Long workId, String content) {
        Work work = workRepository.findById(workId).orElseThrow(() -> new RuntimeException("作品が存在しません"));
        Comment comment = new Comment();
        comment.setUser(user);
        comment.setWork(work); 
        comment.setContent(content);
        comment.setCreatedAt(ZonedDateTime.now());
        commentRepository.save(comment);
    }

    /**
     * いいね増加
     */
    @Transactional
    public int incrementLike(Long workId) {
        Work work = workRepository.findById(workId).orElseThrow();
        work.setLikesCount((work.getLikesCount() == null ? 0 : work.getLikesCount()) + 1);
        return work.getLikesCount();
    }

    /**
     * いいね減少
     */
    @Transactional
    public int decrementLike(Long workId) {
        Work work = workRepository.findById(workId)
                .orElseThrow(() -> new RuntimeException("作品が存在しません"));
        int currentLikes = (work.getLikesCount() == null) ? 0 : work.getLikesCount();
        if (currentLikes > 0) {
            work.setLikesCount(currentLikes - 1);
        }
        return work.getLikesCount();
    }

    /**
     * アルバム追加
     */
    @Transactional
    public void addWorkToAlbum(User user, Long workId) {
        Work work = workRepository.findById(workId).orElseThrow();
        if (!user.getAlbumWorks().contains(work)) {
            user.getAlbumWorks().add(work);
            userRepository.save(user);
        }
    }

    /**
     * アルバム削除
     */
    @Transactional
    public void removeWorkFromAlbum(User user, Long workId) {
        Work work = workRepository.findById(workId)
                .orElseThrow(() -> new RuntimeException("作品が存在しません"));
        if (user.getAlbumWorks().contains(work)) {
            user.getAlbumWorks().remove(work);
            userRepository.save(user);
        }
    }
}