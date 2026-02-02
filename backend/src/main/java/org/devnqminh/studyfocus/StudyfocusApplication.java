package org.devnqminh.studyfocus;

import org.devnqminh.studyfocus.model.User;
import org.springframework.boot.CommandLineRunner;
//import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
//import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.devnqminh.studyfocus.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class StudyfocusApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudyfocusApplication.class, args);
    }

    
@Bean
CommandLineRunner init(UserRepository userRepository) {
    return args -> {
        if (userRepository.findByUsername("testuser").isEmpty()) {
            User user = User.builder()
                .name("Test User")
                .username("testuser")
                .email("testuser@example.com")
                .passwordHash(new BCryptPasswordEncoder().encode("123456"))
                .createdAt(java.time.Instant.now())
                .status("ACTIVE")
                .build();
            userRepository.save(user);
        }
    };
}

}
