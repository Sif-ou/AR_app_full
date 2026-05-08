package com.example.demo.Chat_Bot;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AI_ModelService {

    private final String apiKey;
    private final RestClient restClient;
    private final AI_Model internalModel = new AI_Model();

    public AI_ModelService(@Value("${api.key}") String apiKey) {
        this.apiKey = apiKey;
        this.restClient = RestClient.builder()
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public AI_Model.ChatResponse API_Message(String prompt) {
        // 1. Structure the request body
        AI_Model.Message userMessage = new AI_Model.Message(
                "user", 
                List.of(new AI_Model.Part(prompt))
        );

        AI_Model.Message systemInstruction = new AI_Model.Message(
                "system", 
                List.of(new AI_Model.Part(internalModel.getMyPrompt()))
        );

        AI_Model.ChatRequest request = new AI_Model.ChatRequest(
                List.of(userMessage),
                systemInstruction
        );

    String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        return restClient.post()
                .uri(url)
                .body(request)
                .retrieve()
                .body(AI_Model.ChatResponse.class);
    }

    public String executeReasoningWorkflow(String prompt) {

        try {
            AI_Model.ChatResponse response = API_Message(prompt);
            if (response != null && response.choices() != null && !response.choices().isEmpty()) {
                return response.choices().get(0).message().content();
            }
        } catch (Exception e) {
            System.err.println("API ERROR: " + e.getMessage());
            e.printStackTrace();
        }
        return "ERROR: AI failed to respond please try again later";

    }
}

/* 
@Service
public class AI_ModelService {

    private AI_Model open_router_model = new AI_Model() ;                  // google/gemma-4-26b-a4b-it:free
    private final RestClient restClient;
    private static final String MODEL = "gemini-2.5-flash";  // google/gemma-4-26b-a4b-it:free // deepseek-ai/deepseek-v3.2 // google/gemma-4-31b-it:free
    private String content  ;

    /* model prompt here  */
    // private String ModelPrompt = open_router_model.getMyPrompt() ;
/* 
    private Message  PromptMessage = new Message( 
                                                  "system"
                                                  , ModelPrompt                                                
                                                  , null 
                                                );*/

                                                /* Update this line in your class variables area */
/*private Message PromptMessage = new Message(
        "user",
        List.of(new AI_Model.Part(ModelPrompt)), 
        null
);
*/
    /* #################################################################### */

  /*  public void setContent( String content )
    {
        this.content = content ;
    }

*/

    /*public AI_ModelService(@Value("${api.key}") String apiKey) {       // https://openrouter.ai/api/v1
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")  // https://openrouter.ai/api/v1 // https://integrate.api.nvidia.com/v1
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }*/

  /*public AI_ModelService(@Value("${api.key}") String apiKey) {
    this.restClient = RestClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
            .defaultHeader("Content-Type", "application/json")
            .build();
}*/

/*
public AI_ModelService(@Value("${api.key}") String apiKey) {
    this.restClient = RestClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
            .defaultHeader("Content-Type", "application/json")
            .build();
}
*/
/* 
public ChatResponse API_Message(String prompt) { 

    Message userMessage = new Message("user", prompt, null);
    
    ChatRequest request = new ChatRequest(
            MODEL,
            List.of(PromptMessage, userMessage), 
            null 
    );

    return restClient.post()
            .uri("/chat/completions")
            // CHANGE THIS: Use your actual production URL
            .header("HTTP-Referer", "https://ar-app-back-end.onrender.com") 
            .header("X-Title", "Smart Retail AR App") // Optional: Shows your app name in OpenRouter/AI logs
            .body(request) 
            .retrieve()
            .body(ChatResponse.class);
}
*/
/* 
public ChatResponse API_Message(String prompt) { 

    Message userMessage = new Message("user", prompt, null);
    
    ChatRequest request = new ChatRequest(
            null, 
            List.of(PromptMessage, userMessage), 
            null 
    );

    return restClient.post()
            .uri("/gemini-1.5-flash:generateContent?key=" + System.getProperty("api.key")) 
            .body(request) 
            .retrieve()
            .body(ChatResponse.class);
}
*/

/* 
public ChatResponse API_Message(String prompt) { 
    Message userMessage = new Message(
            "user", 
            List.of(new AI_Model.Part(prompt)), 
            null
    );

    
    ChatRequest request = new ChatRequest(
            null, 
            List.of(userMessage), 
            null 
    );

    return restClient.post()
            .uri("/gemini-1.5-flash:generateContent?key=" + apikey ) 
            .body(request) 
            .retrieve()
            .body(ChatResponse.class);
}*/


/* 

public String executeReasoningWorkflow(String prompt) { 
    ChatResponse response = null; 
    try {
        response = API_Message(prompt); 

        if (response != null && response.choices() != null && !response.choices().isEmpty()) {
            return response.choices().get(0).message().content();
        }
    } catch (Exception e) {
        // Change this to print the FULL error details
        e.printStackTrace(); 
        System.out.println("FULL JAVA ERROR: " + e.toString());
    }
    return "ERROR: AI failed to respond";
}

}*/