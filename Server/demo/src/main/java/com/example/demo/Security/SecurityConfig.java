package com.example.demo.Security;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final AuthenticationProvider authenticationProvider;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, UserDetailsService userDetailsService, AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
        this.authenticationProvider = authenticationProvider;
    }

@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Handle CORS using your custom configuration source bean and disable CSRF
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())

            // 2. Configure endpoint rules safely
            .authorizeHttpRequests(auth -> auth
                // Allow all pre-flight OPTIONS requests to pass through cleanly
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Public endpoints
                .requestMatchers("/api/auth/**", "/api/auth").permitAll()
                .requestMatchers("/api/auth/google", "/api/auth/google/").permitAll()
                .requestMatchers("/api/public/**", "/api/public").permitAll()
                .requestMatchers("/api/chat/**", "/api/chat").permitAll()
                .requestMatchers("/api/products", "/api/products/**").permitAll()
                
                // Secure stock / resource endpoints
                .requestMatchers("/api/colors", "/api/colors/**").authenticated()
                .requestMatchers("/api/variants", "/api/variants/**").authenticated()
                .requestMatchers("/api/media", "/api/media/**").authenticated()
                .requestMatchers("/api/add", "/api/add/**").authenticated()
                
                // Secure admin endpoints (Now safely ahead of the final catch-all)
                .requestMatchers("/api/admin", "/api/admin/**").hasAuthority("ADMIN")

                // 3. Absolute final fallback catch-all rule
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            
            // 4. Inject JWT processing filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allowed client endpoints - Added production, localhost, and Vercel preview environments
        configuration.setAllowedOrigins(Arrays.asList(
            "https://ar-app-full-delta.vercel.app", 
            "http://localhost:3000"
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Accept common authentication headers passed by client applications
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "Cache-Control", 
            "Accept", 
            "X-Requested-With"
        ));
        
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}