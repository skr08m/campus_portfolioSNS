package com.example.campus_portfolio.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    String username;
    String mailAddress;
    String password;
}
