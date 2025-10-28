package com.server.app.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.server.app.dto.book.BookCreateDto;
import com.server.app.entities.Book;
import com.server.app.services.BookService;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody BookCreateDto dto) {
        Book createdBook = bookService.create(dto);
        return ResponseEntity.ok(createdBook);
    }

    @GetMapping
    public ResponseEntity<List<Book>> getBooks() {
        List<Book> books = bookService.findAll();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable long id) {
        Optional<Book> bookOpt = bookService.findById(id);
        return bookOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/gender/{genderId}")
    public ResponseEntity<List<Book>> getBooksByGender(@PathVariable long genderId) {
        List<Book> books = bookService.findAllByGenderId(genderId);
        return ResponseEntity.ok(books);
    }

    // Eliminar un libro por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable long id) {
        Optional<Book> bookOpt = bookService.findById(id);
        if (bookOpt.isPresent()) {
            bookService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
