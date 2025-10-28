package com.server.app.services;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.server.app.dto.book.BookCreateDto;
import com.server.app.dto.book.BookUpdateDto;
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

    public Book update(long id, BookUpdateDto dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        if (dto.getAuthor() != null)
            book.setAuthor(dto.getAuthor());
        if (dto.getName() != null)
            book.setName(dto.getName());
        if (dto.getGender() != null) {
            genderService.findById(dto.getGender()).ifPresent(book::setGender);
        }

        return bookRepository.save(book);
    }

    public Optional<Book> findById(long id) {
        return bookRepository.findById(id);
    }

    public void delete(long id) {
        bookRepository.deleteById(id);
    }

    public Page<Book> findAll(int page, int size) {
        return bookRepository.findAll(PageRequest.of(page, size));
    }

    public Page<Book> findByGenderId(long genderId, int page, int size) {
        var genderOpt = genderService.findById(genderId);
        if (genderOpt.isPresent()) {
            PageRequest pageable = PageRequest.of(page, size);
            return bookRepository.findByGender(genderOpt.get(), pageable);
        }
        return Page.empty();
    }
}
