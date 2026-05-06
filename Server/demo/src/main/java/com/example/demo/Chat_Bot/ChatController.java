package com.example.demo.Chat_Bot ;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

    private final AI_ModelService AI_Service;
    

    public ChatController(AI_ModelService openRouterService) {
        this.AI_Service = openRouterService;
    }

@PostMapping
    public String testStrawberryReasoning(@RequestBody Map<String, String> payload) {
        // Extract the "prompt" field from the JSON body
        String prompt = payload.get("prompt");
        
        // Handle cases where the prompt might be null or empty
        if (prompt == null || prompt.trim().isEmpty()) {
            return "No prompt provided.";
        }
        
        return AI_Service.executeReasoningWorkflow(prompt);
    }

}

    /*@GetMapping("/strawberry-test")
    public String testStrawberryReasoning() {
        return openRouterService.executeReasoningWorkflow();

    }*/