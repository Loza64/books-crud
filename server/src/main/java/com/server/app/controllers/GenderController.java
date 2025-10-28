package com.server.app.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.server.app.dto.gender.GenderDto;
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
    public ResponseEntity<List<Gender>> getAllGenders() {
        List<Gender> genders = genderService.findAll();
        return ResponseEntity.ok(genders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gender> getGenderById(@PathVariable long id) {
        Optional<Gender> genderOpt = genderService.findById(id);
        return genderOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
