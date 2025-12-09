package com.example.campus_portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
	public JwtDecoder jwtDecoder() {
		return NimbusJwtDecoder.withPublicKey(getPublicKey()).build();
	}

	private java.security.interfaces.RSAPublicKey getPublicKey() {
		try {
			java.security.spec.X509EncodedKeySpec spec = new java.security.spec.X509EncodedKeySpec(
					java.util.Base64.getDecoder().decode(PUBLIC_KEY.replaceAll("\\n", "")
							.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "")));
			return (java.security.interfaces.RSAPublicKey) java.security.KeyFactory.getInstance("RSA")
					.generatePublic(spec);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	// どのURLからのアクセスなら認証なしで通すかを決める
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
						}));

		return http.build();
	}

	// ハッシュ化に使用する関数を定義
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
