package com.server.app.dto.book;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookUpdateDto {
    @Size(max = 50, message = "El nombre no puede superar los 50 caracteres")
    private String name;

    @Size(max = 50, message = "El nombre del autor no puede superar los 50 caracteres")
    private String author;

    @Positive(message = "El roleId debe ser un número positivo")
    private Long gender;
}
