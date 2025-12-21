package com.example.campus_portfolio.service;

import com.example.campus_portfolio.dto.CommentCreateRequestDto;
import com.example.campus_portfolio.dto.CommentResponseDto;
import com.example.campus_portfolio.entity.Comment;
import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.entity.Work;
import com.example.campus_portfolio.repository.CommentRepository;
import com.example.campus_portfolio.repository.UserRepository;
import com.example.campus_portfolio.repository.WorkRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final WorkRepository workRepository;
    private final UserRepository userRepository;

    //コメント投稿
    public CommentResponseDto createComment(
            Long workId,
            Long userId,
            CommentCreateRequestDto request
    ) {
        Work work = workRepository.findById(workId)
                .orElseThrow(() -> new RuntimeException("作品が見つかりません"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ユーザが見つかりません"));

        Comment comment = new Comment();
        comment.setWorkId(work);
        comment.setUser(user);
        comment.setCommentContent(request.getContent());
        comment.setSentAt(ZonedDateTime.now());

        Comment saved = commentRepository.save(comment);

        return toResponseDto(saved);
    }

    //コメント一覧取得
    @Transactional(readOnly = true)
    public List<CommentResponseDto> getComments(Long workId) {

        // 作品存在チェック（404用途）
        if (!workRepository.existsById(workId)) {
            throw new RuntimeException("作品が見つかりません");
        }

        return commentRepository.findByWorkId_WorkId(workId).stream()
                .map(this::toResponseDto)
                .toList();
    }

    //コメント削除（本人,管理者）
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("コメントが存在しません"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ユーザーが存在しません"));

        boolean isAdmin = "ROLE_ADMIN".equals(user.getRole());

        if (!isAdmin && !comment.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("削除権限がありません");
        }

        commentRepository.delete(comment);
    }

    //DTO 変換
    private CommentResponseDto toResponseDto(Comment comment) {
        return new CommentResponseDto(
                comment.getCommentId(),
                comment.getUser().getUserId(),
                comment.getUser().getUsername(),
                comment.getCommentContent(),
                comment.getSentAt()
        );
    }
}
