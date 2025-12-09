package com.example.campus_portfolio.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final AuthenticationManager authenticationManager;
    private final JwtService tokenProvider;

    // ユーザー登録
    public Boolean register(String email, String rawPassword, String userName) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("すでに登録済みです");
        }

        // Userモデルの作成と保存
        User user = new User();
        user.setMailAddress(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setUsername(userName);
        userRepository.save(user);
        return true;
    }

    // ログイン
    public String login(String email, String password) {
        Authentication auth = new UsernamePasswordAuthenticationToken(email, password);
        Authentication authentication = authenticationManager.authenticate(auth);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String userId = String.valueOf(user.getUser_id());

        return tokenProvider.generateJwt(userId);
    }

    // 現在のユーザー取得
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("ユーザーが認証されていません");
        }
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
