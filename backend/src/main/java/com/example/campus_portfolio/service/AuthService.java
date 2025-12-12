package com.example.campus_portfolio.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.campus_portfolio.security.JwtService;
import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    // private final AuthenticationManager authenticationManager;
    private final JwtService tokenProvider;

    // ユーザー登録
    public String register(String email, String rawPassword, String userName) {
        if (userRepository.findByMailAddress(email).isPresent()) {
            throw new RuntimeException("すでに登録済みです");
        }

        // Userモデルの作成と保存
        User user = new User();
        user.setMailAddress(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setUsername(userName);
        user.setRole("ROLE_USER");
        user = userRepository.save(user);
        return tokenProvider.generateJwt(String.valueOf(user.getUserId()));
    }

    // ログイン
    public String login(String email, String rawPassword) {
        // Authentication auth = new UsernamePasswordAuthenticationToken(email,
        // rawPassword);
        // Authentication authentication = authenticationManager.authenticate(auth);
        // SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByMailAddress(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // パスワード照合
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        // JWTを生成
        String userId = String.valueOf(user.getUserId());
        return tokenProvider.generateJwt(userId);
    }

    // 現在のユーザー取得
    public Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("ユーザーが認証されていません");
        }
        Jwt jwt = (Jwt) auth.getPrincipal();
        Long userId = Long.valueOf(jwt.getSubject());
        return userId;
    }
}
