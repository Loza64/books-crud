package com.server.app.services;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.server.app.dto.gender.GenderDto;
import com.server.app.entities.Gender;
import com.server.app.repositories.GenderRepository;

@Service
public class GenderService {

    private final GenderRepository genderRepository;

    public GenderService(GenderRepository genderRepository) {
        this.genderRepository = genderRepository;
    }

    public Gender create(GenderDto dto) {
        Gender gender = new Gender();
        gender.setName(dto.getName());
        return genderRepository.save(gender);
    }

    public Page<Gender> findAll(int page, int size) {
        return genderRepository.findAll(PageRequest.of(page, size));
    }

    public Optional<Gender> findById(long id) {
        return genderRepository.findById(id);
    }
}
