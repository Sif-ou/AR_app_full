package com.example.demo.Chat_Bot;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = {"Content-Type", "Accept"}, methods = {RequestMethod.POST, RequestMethod.OPTIONS})
public class ChatController {

    private final AI_ModelService AI_Service;

    public ChatController(AI_ModelService AI_Service) {
        this.AI_Service = AI_Service;
    }

    @PostMapping("/chat")
    public String handleChatWorkflow(@RequestBody List<AI_Model.Message> chatHistory) {
        if (chatHistory == null || chatHistory.isEmpty()) {
            return "No chat history provided.";
        }
        return AI_Service.executeReasoningWorkflow(chatHistory);
    }
}