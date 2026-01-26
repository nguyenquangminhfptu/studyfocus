package org.devnqminh.studyfocus.service.Impl.authen;

import org.devnqminh.studyfocus.dto.request.authentication.LoginRequest;
import org.devnqminh.studyfocus.dto.request.authentication.RegisterRequest;
import org.devnqminh.studyfocus.dto.response.authentication.LoginResponse;
import org.devnqminh.studyfocus.model.User;
import org.devnqminh.studyfocus.repository.UserRepository;
import org.devnqminh.studyfocus.service.IAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthServiceImpl implements IAuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private  PasswordEncoder passwordEncoder;

    //Implement JWT token generation
    private String generateToken(User user) {
        return "dummy-jwt-token";
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPasswordHash()
        )) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = "dummy-token";
        return new LoginResponse(token, user.getUsername());
    }

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setCreatedAt(Instant.now());
        user.setStatus("ACTIVE");
        userRepository.save(user);
    }

}
