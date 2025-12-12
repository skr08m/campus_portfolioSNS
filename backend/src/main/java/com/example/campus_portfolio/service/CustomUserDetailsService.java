package com.example.campus_portfolio.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import com.example.campus_portfolio.entity.User;
import com.example.campus_portfolio.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
// AuthServiceで使用しているクラスです
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByMailAddress(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User.builder()
                .username(String.valueOf(user.getUserId()))//usernameだけどIDのこと
                .password(user.getPassword()) // DBのハッシュ
                .roles(user.getRole()) // 役割
                .build();
    }
}
