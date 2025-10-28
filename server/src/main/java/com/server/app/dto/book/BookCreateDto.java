package com.server.app.dto.book;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookCreateDto {

    @NotBlank(message = "El nombre del libro es obligatorio")
    @Size(max = 50, message = "El nombre no puede superar los 50 caracteres")
    private String name;

    @NotBlank(message = "El autor es obligatorio")
    @Size(max = 50, message = "El nombre del autor no puede superar los 50 caracteres")
    private String author;

    @NotNull(message = "El genderId es obligatorio")
    @Positive(message = "El roleId debe ser un número positivo")
    private Long gender;
}
