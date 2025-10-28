package com.server.app.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.server.app.dto.gender.GenderDto;
import com.server.app.dto.response.PageResponse;
import com.server.app.entities.Gender;
import com.server.app.services.GenderService;

@RestController
@RequestMapping("/api/genders")
public class GenderController {

    private final GenderService genderService;

    public GenderController(GenderService genderService) {
        this.genderService = genderService;
    }

    @PostMapping
    public ResponseEntity<Gender> createGender(@RequestBody GenderDto dto) {
        Gender createdGender = genderService.create(dto);
        return ResponseEntity.ok(createdGender);
    }

    @GetMapping
    public ResponseEntity<PageResponse<Gender>> getAllGenders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Gender> gendersPage = genderService.findAll(page, size);
        PageResponse<Gender> response = new PageResponse<>(
                gendersPage.getContent(),
                gendersPage.getNumber(),
                gendersPage.getSize(),
                gendersPage.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gender> getGenderById(@PathVariable long id) {
        return genderService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
