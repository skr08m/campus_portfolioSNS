package com.example.campus_portfolio.controller;

import com.example.campus_portfolio.dto.LoginRequest;
import com.example.campus_portfolio.dto.RegisterRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

    }

    @PostMapping("register")
    public String login(@RequestBody RegisterRequest request) {

    }

}
