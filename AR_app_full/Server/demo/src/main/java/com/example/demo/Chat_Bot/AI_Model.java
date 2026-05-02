package com.example.demo.Chat_Bot;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AI_Model {
    private String prompt;

    public AI_Model() {
        try {
            getPromptTemplate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ChatRequest(
            @JsonProperty("contents") List<Message> messages,
            @JsonProperty("system_instruction") Message systemInstruction
    ) {}

    public record Message(
            @JsonProperty("role") String role,
            @JsonProperty("parts") List<Part> parts
    ) {
        public String content() {
            return (parts != null && !parts.isEmpty()) ? parts.get(0).text() : "";
        }
    }

    public record Part(@JsonProperty("text") String text) {}

    public record ChatResponse(@JsonProperty("candidates") List<Choice> choices) {}

    public record Choice(@JsonProperty("content") Message message) {}

    private void getPromptTemplate() throws Exception {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("templates/model_prompt.txt")) {
            if (is == null) throw new IllegalArgumentException("model_prompt.txt not found in resources/templates/");
            this.prompt = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    public String getMyPrompt() {
        return this.prompt;
    }
}

/* 
public class AI_Model {

    private String InputMessage ;
    private String prompt ;

    public AI_Model () {
        try {
            getPromptTemplate() ;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setInputMessage(String InputMessage) {
        this.InputMessage = InputMessage;
    }

    public String getInputMessage () 
    {
        return this.InputMessage ;
    }

    public void  ClearInputMessage() {
        this.InputMessage = null ;
    }


    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ChatRequest(
            String model,
            List<Message> messages,
            Reasoning reasoning
    ) {}

    public record Reasoning(boolean enabled) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Message(
            String role,
            String content,
            @JsonProperty("reasoning_details") Object reasoningDetails
    ) {}

    public record ChatResponse(List<Choice> choices) {}

    public record Choice(Message message) {}


  private void getPromptTemplate() throws Exception {
    
    try ( InputStream is = getClass().getClassLoader().getResourceAsStream("templates/model_prompt.txt") ) {
        if (is == null) throw new IllegalArgumentException("File not found!");
        this.prompt = new String( is.readAllBytes() , StandardCharsets.UTF_8 );

    }
}

   public String getMyPrompt () 
   {
     return this.prompt ;
   }


   

}*/