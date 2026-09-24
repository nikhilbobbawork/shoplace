package com.shoplace.shoplace_backend.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.shoplace.shoplace_backend.entity.User;
import com.shoplace.shoplace_backend.repository.UserRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserRepository userRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/oauth2/**", "/login/**", "/api/products/**").permitAll()
                .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                .successHandler((request, response, authentication) -> {
                    DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();

                    String login = oauthUser.getAttribute("login");
                    String rawName = oauthUser.getAttribute("name");
                    String rawEmail = oauthUser.getAttribute("email");

                    final String name = (rawName != null) ? rawName : (login != null ? login : "GitHub User");
                    final String email = (rawEmail != null) ? rawEmail : (login != null ? login + "@github.user.local" : "user@github.user.local");

                    User user = userRepository.findByEmail(email).orElseGet(() -> {
                        User newUser = new User();
                        newUser.setName(name);
                        newUser.setEmail(email);

                        // Instantiating encoder directly avoids the circular dependency bean cycle
                        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                        String randomPassword = "Password";
                        newUser.setPassword(encoder.encode(randomPassword));

                        return userRepository.save(newUser);
                    });

                    String token = "github-jwt-token-" + user.getId() + "-" + System.currentTimeMillis();
                    response.sendRedirect("http://localhost:4200/auth-success?token=" + token);
                })
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
