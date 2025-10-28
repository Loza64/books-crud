package com.server.app.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.server.app.entities.Book;
import com.server.app.entities.Gender;

@EnableJpaRepositories
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByGender(Gender gender);
}
