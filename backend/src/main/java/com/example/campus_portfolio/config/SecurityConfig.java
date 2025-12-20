package com.example.campus_portfolio.config;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
	// ないとバグるやつ
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();

		// ReactのURL（開発用）
		config.addAllowedOrigin("http://localhost:3000");
		config.addAllowedOrigin("http://localhost:5173");
		// 本番も含めて全部許可したいなら ↓（開発中のみ）
		// config.addAllowedOriginPattern("*");

		config.addAllowedMethod("*"); // GET, POST, PUT, DELETE, OPTIONS
		config.addAllowedHeader("*"); // Authorization など
		config.setAllowCredentials(true); // JWTを送るなら必要

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
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
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
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
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
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
