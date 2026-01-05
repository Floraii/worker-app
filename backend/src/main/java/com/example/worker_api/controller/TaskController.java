package com.example.worker_api.controller;

import com.example.worker_api.model.Task;
import com.example.worker_api.model.Worker;
import com.example.worker_api.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;
import com.example.worker_api.repository.WorkerRepository;


import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {
        "http://localhost:5173",
})
public class TaskController {

    private final TaskRepository taskRepository;
    private final WorkerRepository workerRepository;

public TaskController(TaskRepository taskRepository, WorkerRepository workerRepository) {
    this.taskRepository = taskRepository;
    this.workerRepository = workerRepository;
}


    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
public Task createTask(@RequestBody Task newTask) {
    if (newTask.getStatus() == null || newTask.getStatus().isBlank()) {
        newTask.setStatus("OPEN");
    }

    if (newTask.getWorker() == null || newTask.getWorker().getId() == null) {
        throw new RuntimeException("Worker is required");
    }

    Long workerId = newTask.getWorker().getId();
    Worker worker = workerRepository.findById(workerId)
            .orElseThrow(() -> new RuntimeException("Worker not found"));

    newTask.setWorker(worker);

    return taskRepository.save(newTask);
}



    @PatchMapping("/{id}/status")
    public Task updateStatus(@PathVariable Long id, @RequestBody Task body) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(body.getStatus());
        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }
}
