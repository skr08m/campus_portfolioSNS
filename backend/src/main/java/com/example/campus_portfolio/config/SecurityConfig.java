package com.example.campus_portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http
				.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/auth/login").permitAll()
						.requestMatchers("/auth/register").permitAll()
						.anyRequest().authenticated())
				.oauth2ResourceServer(oauth -> oauth
						.jwt(jwt -> {
						}) // ★ 新しい構文（ここは空でOK）
				);

		return http.build();
	}
}
