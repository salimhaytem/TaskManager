// ProjectResponse.java
package com.hahn.taskmanager.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private int totalTasks;
    private int completedTasks;
    private double progressPercentage;
}