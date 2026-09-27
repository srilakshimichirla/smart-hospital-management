package com.example.smart_hospital_management.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/login")
    public String loginPage() {
        return "forward:/WEB-INF/views/login.jsp";
    }

    @GetMapping("/signup")
    public String signupPage() {
        return "forward:/WEB-INF/views/signup.jsp";
    }

    @GetMapping("/dashboard")
    public String dashboardPage() {
        return "forward:/WEB-INF/views/dashboard.jsp";
    }
}