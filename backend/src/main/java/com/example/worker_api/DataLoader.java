package com.example.worker_api;

import com.example.worker_api.model.Task;
import com.example.worker_api.model.Worker;
import com.example.worker_api.repository.TaskRepository;
import com.example.worker_api.repository.WorkerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final TaskRepository taskRepository;
    private final WorkerRepository workerRepository;

    public DataLoader(TaskRepository taskRepository, WorkerRepository workerRepository) {
        this.taskRepository = taskRepository;
        this.workerRepository = workerRepository;
    }

    @Override
    public void run(String... args) {

        if (workerRepository.count() == 0) {
            workerRepository.save(new Worker("Anna", "anna@example.com"));
            workerRepository.save(new Worker("Johan", "johan@example.com"));
            workerRepository.save(new Worker("Sara", "sara@example.com"));
        }

        if (taskRepository.count() == 0) {
            List<Worker> workers = workerRepository.findAll();
            Worker anna = workers.stream().filter(w -> "Anna".equals(w.getName())).findFirst().orElse(null);
            Worker johan = workers.stream().filter(w -> "Johan".equals(w.getName())).findFirst().orElse(null);
            Worker sara = workers.stream().filter(w -> "Sara".equals(w.getName())).findFirst().orElse(null);

            Task t1 = new Task("Skriv rapport", "OPEN");
            t1.setWorker(anna);
            taskRepository.save(t1);

            Task t2 = new Task("Testa ny funktion", "IN_PROGRESS");
            t2.setWorker(johan);
            taskRepository.save(t2);

            Task t3 = new Task("Rensa backlog", "DONE");
            t3.setWorker(sara);
            taskRepository.save(t3);
        }
    }
}
