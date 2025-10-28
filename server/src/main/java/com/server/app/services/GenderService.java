package com.server.app.services;

import java.util.List;
import java.util.Optional;

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
        Gender data = new Gender();
        data.setName(dto.getName());
        return genderRepository.save(data);
    }

    public List<Gender> findAll() {
        return genderRepository.findAll();
    }

    public Optional<Gender> findById(long id) {
        return genderRepository.findById(id);
    }
}
