package com.server.app.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.server.app.dto.book.BookCreateDto;
import com.server.app.dto.book.BookUpdateDto;
import com.server.app.dto.response.PageResponse;
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

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable long id, @RequestBody BookUpdateDto dto) {
        Book updatedBook = bookService.update(id, dto);
        return ResponseEntity.ok(updatedBook);
    }

    @GetMapping
    public ResponseEntity<PageResponse<Book>> getBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long gender) {
        Page<Book> booksPage = bookService.findAll(page, size, gender);
        PageResponse<Book> response = new PageResponse<>(
                booksPage.getContent(),
                booksPage.getNumber(),
                booksPage.getSize(),
                booksPage.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/gender/{genderId}")
    public ResponseEntity<PageResponse<Book>> getBooksByGender(
            @PathVariable long genderId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Book> booksPage = bookService.findByGenderId(genderId, page, size);
        PageResponse<Book> response = new PageResponse<>(
                booksPage.getContent(),
                booksPage.getNumber(),
                booksPage.getSize(),
                booksPage.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable long id) {
        return bookService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable long id) {
        return bookService.findById(id)
                .map(book -> {
                    bookService.delete(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
