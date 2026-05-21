package com.example.demo.Chat_Bot;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
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
            @JsonProperty("system_instruction") Message systemInstruction,
            @JsonProperty("tools") List<Tool> tools
    ) {}

    public record Message(
            @JsonProperty("role") String role,
            @JsonProperty("parts") List<Part> parts
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Part(
            @JsonProperty("text") String text,
            @JsonProperty("functionCall") FunctionCall functionCall,
            @JsonProperty("functionResponse") FunctionResponse functionResponse
    ) {
        // Convenience constructor for regular text parts
        public Part(String text) {
            this(text, null, null);
        }
    }

    public record FunctionCall(
            @JsonProperty("name") String name,
            @JsonProperty("args") Map<String, Object> args,
            @JsonProperty("id") String id
    ) {}

    public record FunctionResponse(
            @JsonProperty("name") String name,
            @JsonProperty("response") Map<String, Object> response,
            @JsonProperty("id") String id
    ) {}

    // Tool definition layout
    public record Tool(
            @JsonProperty("function_declarations") List<FunctionDeclaration> functionDeclarations
    ) {}

    public record FunctionDeclaration(
            @JsonProperty("name") String name,
            @JsonProperty("description") String description,
            @JsonProperty("parameters") Schema parameters
    ) {}

    public record Schema(
            @JsonProperty("type") String type,
            @JsonProperty("properties") Map<String, Property> properties,
            @JsonProperty("required") List<String> required
    ) {}

    public record Property(
            @JsonProperty("type") String type,
            @JsonProperty("description") String description
    ) {}

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