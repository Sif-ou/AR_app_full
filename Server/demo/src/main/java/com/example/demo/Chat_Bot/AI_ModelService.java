package com.example.demo.Chat_Bot;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

// Import your actual entity and repository classes
import com.example.demo.Product.Product;
import com.example.demo.Product.ProductRepository;
import com.example.demo.Variants.Variants;

@Service
public class AI_ModelService {

    private final String apiKey;
    private final RestClient restClient;
    private final AI_Model internalModel = new AI_Model();
    private final ProductRepository productRepository;

    // Spring boot automatically injects your Render-connected ProductRepository here
    public AI_ModelService(@Value("${api.key}") String apiKey, ProductRepository productRepository) {
        this.apiKey = apiKey;
        this.productRepository = productRepository;
        this.restClient = RestClient.builder()
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    // Declares the database tool properties so Gemini knows what inputs it can send
    private List<AI_Model.Tool> getAvailableTools() {
        AI_Model.Property queryProp = new AI_Model.Property("STRING", 
                "The product name, keyword, or category the user wants to see (e.g., 'sofa', 'table', 'chair').");
        
        AI_Model.Schema parameters = new AI_Model.Schema(
                "OBJECT",
                Map.of("query", queryProp),
                List.of("query")
        );

        AI_Model.FunctionDeclaration searchDeclaration = new AI_Model.FunctionDeclaration(
                "searchProducts",
                "Queries the live PostgreSQL database on Render to fetch product specifications, dimensions, variants, and store links.",
                parameters
        );

        return List.of(new AI_Model.Tool(List.of(searchDeclaration)));
    }

    // Queries your live database and processes the entities into lightweight maps
    private List<Map<String, Object>> executeRealDatabaseQuery(String queryTerm) {
        System.out.println("--> [JACK ENGINE] Searching Render PostgreSQL for: " + queryTerm);
        List<Map<String, Object>> structuredResults = new ArrayList<>();
        
        try {
            // Leverage your ignore-case containing query method
            List<Product> databaseProducts = productRepository.findByNameContainingIgnoreCase(queryTerm);
            
            // Fallback: If searching by name yielded nothing, attempt a fallback lookup using the category field
            if (databaseProducts.isEmpty()) {
                databaseProducts = productRepository.findByCategory(queryTerm);
            }

            for (Product prod : databaseProducts) {
                // Safely find a default price or variant description if variants exist
                String priceString = "Price upon request";
                if (prod.getQuantity() > 0 && prod.getVariants() != null && !prod.getVariants().isEmpty()) {
                     priceString = "Available in stock"; 
                }

                // Map database values directly into clean JSON arguments for Gemini
                structuredResults.add(Map.of(
                    "name", prod.getName(),
                    "category", prod.getCategory(),
                    "dimensions", prod.getWidth() + "x" + prod.getHeigh() + "x" + prod.getDepth() + " cm",
                    "status", prod.getQuantity() > 0 ? "In Stock (" + prod.getQuantity() + ")" : "Out of Stock",
                    "description", prod.getDescription() != null ? prod.getDescription() : "",
                    // This creates a reliable absolute router link path matching your Next.js application scheme
                    "link", "/products/product/" + prod.getId() 
                ));
            }
        } catch (Exception e) {
            System.err.println("DATABASE TRANSACTION ERROR: " + e.getMessage());
            e.printStackTrace();
        }
        
        return structuredResults;
    }

    // Handles the conversational pipeline loop
    public String executeReasoningWorkflow(List<AI_Model.Message> incomingHistory) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=" + apiKey;

            AI_Model.Message systemInstruction = new AI_Model.Message(
                    "system", 
                    List.of(new AI_Model.Part(internalModel.getMyPrompt()))
            );

            List<AI_Model.Message> conversationHistory = new ArrayList<>(incomingHistory);

            AI_Model.ChatRequest firstRequest = new AI_Model.ChatRequest(
                    conversationHistory,
                    systemInstruction,
                    getAvailableTools()
            );

            AI_Model.ChatResponse firstResponse = restClient.post()
                    .uri(url)
                    .body(firstRequest)
                    .retrieve()
                    .body(AI_Model.ChatResponse.class);

            if (firstResponse == null || firstResponse.choices() == null || firstResponse.choices().isEmpty()) {
                return "ERROR: Chatbot pipeline lost connection to processing agent.";
            }

            AI_Model.Message modelMessage = firstResponse.choices().get(0).message();
            AI_Model.Part firstPart = modelMessage.parts().get(0);

            // Turn 2 Interception: Triggered if Gemini requested tool access
            if (firstPart.functionCall() != null) {
                AI_Model.FunctionCall call = firstPart.functionCall();
                String queryValue = (String) call.args().get("query");

                // Fetch real data from PostgreSQL on Render
                List<Map<String, Object>> dbResults = executeRealDatabaseQuery(queryValue);

                if (dbResults.isEmpty()) {
                    return "I couldn't find any products matching '" + queryValue + "' in our inventory right now.";
                }

                // Format the real items into a beautiful markdown list under the JACK Engine persona
                StringBuilder markdownResponse = new StringBuilder("### JACK Retail Assistant\n");
                markdownResponse.append("I found the following items matching your request:\n\n");

                for (Map<String, Object> item : dbResults) {
                    markdownResponse.append("🔹 **").append(item.get("name")).append("** (").append(item.get("category")).append(")\n")
                                    .append("   - **Dimensions:** ").append(item.get("dimensions")).append("\n")
                                    .append("   - **Status:** ").append(item.get("status")).append("\n");
                    
                    if (!((String)item.get("description")).isEmpty()) {
                        markdownResponse.append("   - **Details:** ").append(item.get("description")).append("\n");
                    }
                    
                    markdownResponse.append("   - 🔗 [View Product Specifications in 3D Architecture](").append(item.get("link")).append(")\n\n");
                }

                return markdownResponse.toString();
            }

            // Fallback for regular greetings or non-database queries
            return firstPart.text();

        } catch (Exception e) {
            System.err.println("CRITICAL SYSTEM EXECUTION ERROR: " + e.getMessage());
            e.printStackTrace();
            return "ERROR: Chatbot failed to calculate output.";
        }
    }
}