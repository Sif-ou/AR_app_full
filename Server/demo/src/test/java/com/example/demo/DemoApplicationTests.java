package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.example.demo.User.UserRepository;

@SpringBootTest
class DemoApplicationTests {

@MockBean
    private UserRepository userRepository;

	@Test
	void contextLoads() {
	}

}
