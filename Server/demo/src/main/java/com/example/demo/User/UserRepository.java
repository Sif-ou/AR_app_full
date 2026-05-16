package com.example.demo.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);


    Optional<User> findByEmail(String email);


    Optional<User> findByPhoneNum(int phoneNum);

/*
@Query("SELECT u FROM User u WHERE u.email = :id OR CONCAT(u.phoneNum, '') = :id")
Optional<User> findByIdentifier(@Param("id") String identifier);*/


}

/*

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
*/