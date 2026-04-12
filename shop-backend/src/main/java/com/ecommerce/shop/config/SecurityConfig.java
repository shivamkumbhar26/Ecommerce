package com.ecommerce.shop.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ecommerce.shop.security.AuthTokenFilter;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private AuthTokenFilter authTokenFilter;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ONLY ONE SecurityFilterChain Bean allowed!
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Enable CORS using the bean defined below
            .cors(Customizer.withDefaults())
            // 2. Disable CSRF for Stateless APIs
            .csrf(csrf -> csrf.disable())
            // 3. Custom 401 Unauthorized Response
            .exceptionHandling(exception -> exception.authenticationEntryPoint((request, response, authException) -> {
                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"status\": 401, \"message\": \"Unauthorized: Please Login first\"}");
            }))
            // 4. Set session to Stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 5. URL Access Rules
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() 
                .requestMatchers("/api/products/**").permitAll()
                // Role-based protection
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/users").hasRole("ADMIN")
                .requestMatchers("/api/orders").hasRole("ADMIN")
                .requestMatchers("/api/orders/checkout").hasRole("USER")
             // UPDATED SECURITY RULES
                .requestMatchers("/api/orders/my").hasAnyRole("USER", "EMPLOYEE", "ADMIN") 
                .requestMatchers("/api/orders/employee/**").hasAnyRole("EMPLOYEE", "ADMIN")
                .requestMatchers("/api/cart/**").hasAnyRole("USER", "EMPLOYEE")
                .anyRequest().authenticated()
            );

        // 6. Add your JWT Filter
        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    // 7. Global CORS configuration that actually solves the Preflight error
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of("*")); // ✅ allow all (for now)
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
