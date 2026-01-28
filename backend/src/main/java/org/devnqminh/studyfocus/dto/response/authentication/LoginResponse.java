package org.devnqminh.studyfocus.dto.response.authentication;

public class LoginResponse {
    private String token;
    private String username;

    public LoginResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }
    public String getToken() {return this.token;}
    public String getUsername() {return this.username;}
}
