package com.example.demo.User;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails ;

import com.example.demo.Role.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users") 
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne 
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role; 

    @Column( nullable = false, unique = true )
    private String username;

    @Column(nullable = false)
    private String password;

    private String email;
    
// In your User.java entity class
@Column(name = "phone_num", nullable = true) // Explicitly set nullable to true
private Integer phoneNum;

@Column(name = "verification_code")
private String verificationCode;

@Column(name = "verification_expiry")
private LocalDateTime verificationExpiry;

    private String address ;
    private boolean active ;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getRoleName())); 
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; 
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.active; // Use your active boolean here
    }

    @Override
    public String getPassword() {
        return this.password ;
    }

@Override
public String getUsername() {
    return this.username; 
}


}
