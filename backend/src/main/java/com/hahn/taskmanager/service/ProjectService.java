package com.hahn.taskmanager.service;

import com.hahn.taskmanager.dto.ProjectRequest;
import com.hahn.taskmanager.dto.ProjectResponse;
import com.hahn.taskmanager.entity.Project;
import com.hahn.taskmanager.entity.User;
import com.hahn.taskmanager.exception.ResourceNotFoundException;
import com.hahn.taskmanager.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final AuthService authService;

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, String userEmail) {
        User user = authService.getCurrentUser(userEmail);

        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUser(user);

        Project savedProject = projectRepository.save(project);
        return mapToResponse(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects(String userEmail) {
        User user = authService.getCurrentUser(userEmail);
        List<Project> projects = projectRepository.findByUserId(user.getId());
        return projects.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long projectId, String userEmail) {
        User user = authService.getCurrentUser(userEmail);
        Project project = projectRepository.findByIdAndUserId(projectId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return mapToResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long projectId, ProjectRequest request, String userEmail) {
        User user = authService.getCurrentUser(userEmail);
        Project project = projectRepository.findByIdAndUserId(projectId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);
        return mapToResponse(updatedProject);
    }

    @Transactional
    public void deleteProject(Long projectId, String userEmail) {
        User user = authService.getCurrentUser(userEmail);
        Project project = projectRepository.findByIdAndUserId(projectId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        projectRepository.delete(project);
    }

    private ProjectResponse mapToResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setCreatedAt(project.getCreatedAt());
        response.setTotalTasks(project.getTotalTasks());
        response.setCompletedTasks(project.getCompletedTasks());
        response.setProgressPercentage(project.getProgressPercentage());
        return response;
    }
}