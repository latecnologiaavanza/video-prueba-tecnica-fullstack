package com.latecnologiaavanza.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI inventoryOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Inventory API")
                .version("v1")
                .description("API REST para el mantenimiento de productos"));
    }

}
