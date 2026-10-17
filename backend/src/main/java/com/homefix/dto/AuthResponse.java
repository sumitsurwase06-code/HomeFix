package com.homefix.dto;

import java.util.List;

public class AuthResponse {
    private String message;
    private String email;
    private List<String> roles;

    public AuthResponse() {
    }

    public AuthResponse(String message, String email, List<String> roles) {
        this.message = message;
        this.email = email;
        this.roles = roles;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
