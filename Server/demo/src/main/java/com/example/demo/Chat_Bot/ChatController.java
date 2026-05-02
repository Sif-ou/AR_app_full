package com.example.demo.Chat_Bot ;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final AI_ModelService AI_Service;
    

    public ChatController(AI_ModelService openRouterService) {
        this.AI_Service = openRouterService;
    }

@GetMapping
public String testStrawberryReasoning(@RequestParam("prompt") String prompt) {
    return AI_Service.executeReasoningWorkflow(prompt); 
}


}

    /*@GetMapping("/strawberry-test")
    public String testStrawberryReasoning() {
        return openRouterService.executeReasoningWorkflow();

    }*/