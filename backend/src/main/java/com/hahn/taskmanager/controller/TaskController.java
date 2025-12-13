package com.hahn.taskmanager.controller;

import com.hahn.taskmanager.dto.TaskRequest;
import com.hahn.taskmanager.dto.TaskResponse;
import com.hahn.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication
    ) {
        TaskResponse response = taskService.createTask(projectId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @PathVariable Long projectId,
            Authentication authentication
    ) {
        List<TaskResponse> tasks = taskService.getAllTasksByProject(projectId, authentication.getName());
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication
    ) {
        TaskResponse response = taskService.updateTask(projectId, taskId, request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{taskId}/toggle")
    public ResponseEntity<TaskResponse> toggleTaskCompletion(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            Authentication authentication
    ) {
        TaskResponse response = taskService.toggleTaskCompletion(projectId, taskId, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            Authentication authentication
    ) {
        taskService.deleteTask(projectId, taskId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}