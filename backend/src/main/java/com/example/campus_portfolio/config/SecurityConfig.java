package com.example.campus_portfolio.config;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
	// ないとバグるやつ
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	public JwtDecoder jwtDecoder(@Value("${jwt.secret-key}") String secretKey) {
		SecretKey key = new SecretKeySpec(secretKey.getBytes(), "HMACSHA256");
		return NimbusJwtDecoder.withSecretKey(key).build();
	}

	// どのURLからのアクセスなら認証なしで通すかを決める
	// フィルターなし用設定
	@Bean
	@Order(1)
	public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {
		http
				.securityMatcher(
						"/api/auth/**",
						"/h2-console/**")
				.authorizeHttpRequests(auth -> auth
						.anyRequest().permitAll())
				.csrf(csrf -> csrf.disable())
				.headers(headers -> headers
						.frameOptions(frame -> frame.disable()));

		return http.build();
	}

	// フィルターあり用設定
	@Bean
	@Order(2)
	public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
		http
				.authorizeHttpRequests(auth -> auth
						.anyRequest().authenticated())
				.csrf(csrf -> csrf.disable())
				.oauth2ResourceServer(oauth -> oauth.jwt());// oauth2サーバを使うと、jwtがないリクエストをすべて弾いてしまいpermitAllできない

		return http.build();
	}

	// ハッシュ化に使用する関数を定義
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
