package com.example.campus_portfolio.controller;

import com.example.campus_portfolio.dto.LoginRequest;
import com.example.campus_portfolio.dto.RegisterRequest;
import com.example.campus_portfolio.security.JwtService;
import com.example.campus_portfolio.service.AuthService;

import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String jwt = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(jwt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request.getMailAddress(), request.getPassWord(), request.getUserName());
            String jwt = authService.login(request.getMailAddress(), request.getPassWord());
            return ResponseEntity.ok(jwt);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
