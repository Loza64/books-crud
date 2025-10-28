package com.server.app.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.server.app.entities.Gender;

@EnableJpaRepositories
public interface GenderRepository extends JpaRepository<Gender, Long> {
    Page<Gender> findAll(Pageable pageable);
}