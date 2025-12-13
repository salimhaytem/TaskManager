package com.hahn.taskmanager;

import com.hahn.taskmanager.entity.User;
import com.hahn.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@RequiredArgsConstructor
public class TaskManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create demo users if they don't exist
            if (!userRepository.existsByEmail("user@example.com")) {
                User user1 = new User();
                user1.setEmail("user@example.com");
                user1.setPassword(passwordEncoder.encode("password123"));
                user1.setFullName("John Doe");
                userRepository.save(user1);
                System.out.println("✅ Demo user created: user@example.com / password123");
            }

            if (!userRepository.existsByEmail("alice@example.com")) {
                User user2 = new User();
                user2.setEmail("alice@example.com");
                user2.setPassword(passwordEncoder.encode("alice123"));
                user2.setFullName("Alice Smith");
                userRepository.save(user2);
                System.out.println("✅ Demo user created: alice@example.com / alice123");
            }

            System.out.println("🚀 Application started successfully on http://localhost:8080");
        };
    }
}