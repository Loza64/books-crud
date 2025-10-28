package com.server.app.controllers;

import com.server.app.dto.response.PageResponse;
import com.server.app.dto.role.RoleDto;
import com.server.app.entities.Role;
import com.server.app.services.RoleService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    public ResponseEntity<Role> save(@Valid @RequestBody RoleDto role) {
        return ResponseEntity.ok(roleService.save(role));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> update(@PathVariable Long id, @Valid @RequestBody RoleDto dto) {
        Role updatedRole = roleService.update(id, dto);
        return ResponseEntity.ok(updatedRole);
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<Role> assignPermissions(@PathVariable Long id, @RequestBody Set<Long> permissionIds) {
        return ResponseEntity.ok(roleService.assignPermissions(id, permissionIds));
    }

    @GetMapping
    public ResponseEntity<PageResponse<Role>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Role> rolesPage = roleService.findAll(page, size);

        PageResponse<Role> response = new PageResponse<>(
                rolesPage.getContent(),
                rolesPage.getNumber(),
                rolesPage.getSize(),
                rolesPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    // -------------------- GET BY ID --------------------
    @GetMapping("/{id}")
    public ResponseEntity<Role> findById(@PathVariable Long id) {
        return roleService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // -------------------- DELETE --------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        roleService.delete(id);
        return ResponseEntity.ok("Rol eliminado");
    }
}
