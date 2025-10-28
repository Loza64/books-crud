package com.server.app.services;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.server.app.dto.book.BookCreateDto;
import com.server.app.entities.Book;
import com.server.app.repositories.BookRepository;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final GenderService genderService;

    public BookService(BookRepository bookRepository, GenderService genderService) {
        this.bookRepository = bookRepository;
        this.genderService = genderService;
    }

    public Book create(BookCreateDto dto) {
        Book book = new Book();
        book.setAuthor(dto.getAuthor());
        book.setName(dto.getName());

        if (dto.getGender() != null) {
            genderService.findById(dto.getGender()).ifPresent(book::setGender);
        }

        return bookRepository.save(book);
    }

    public Optional<Book> findById(long id) {
        return bookRepository.findById(id);
    }

    public List<Book> findAllByGenderId(long id) {
        return genderService.findById(id)
                .map(bookRepository::findByGender)
                .orElse(Collections.emptyList());
    }

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public void delete(long id) {
        bookRepository.deleteById(id);
    }
}
