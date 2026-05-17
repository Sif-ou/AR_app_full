package com.example.demo.Admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.User.User;
import com.example.demo.User.UserRepository;
import com.example.demo.Role.Role;
import com.example.demo.Role.RoleRepository;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") 
public class AdminController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/add/account")
    public ResponseEntity<?> provisionAccount(@RequestBody AdminProvisionRequest request) {
        
        // 1. Safeguard against duplicate emails
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "This email identifier is already registered."));
        }

        // 2. Fetch the Role Entity using the text name sent in the JSON payload
        Optional<Role> databaseRole = roleRepository.findByRoleName(request.getRole());
        if (databaseRole.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Requested system role '" + request.getRole() + "' does not exist."));
        }

        // 3. Build the user instance from administrative parameters
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        
        // 4. Safely parse incoming String phone into an Integer to match your existing schema
        try {
            // Strips out non-numeric data if a user accidentally types dashes or spaces
            String cleanPhone = request.getPhoneNumber().replaceAll("[^0-9]", "");
            newUser.setPhoneNum(Integer.parseInt(cleanPhone)); 
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Phone number must be a valid integer under 2147483647."));
        }
        
        // 5. Connect the database Role object
        newUser.setRole(databaseRole.get()); 
        
        // 6. Encrypt password
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // 7. Make active immediately
        newUser.setActive(true); 
        newUser.setVerificationCode(null);
        newUser.setVerificationExpiry(null);

        // Commit to database
        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("message", "Operational profile provisioned into system registry successfully!"));
    }



@PutMapping("/status/{userId}")
public ResponseEntity<?> toggleUserStatus(
        @PathVariable Long userId, 
        @RequestParam boolean active) {
    

    Optional<User> userOptional = userRepository.findById(userId);
    if (userOptional.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User with ID " + userId + " does not exist."));
    }

    User user = userOptional.get();
    

    user.setActive(active);
    userRepository.save(user);

    String statusText = active ? "activated and granted access." : "deactivated and blocked from entering.";
    return ResponseEntity.ok(Map.of(
        "message", "User account '" + user.getUsername() + "' has been successfully " + statusText,
        "active", user.isActive()
    ));
}

}