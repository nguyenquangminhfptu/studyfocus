package org.devnqminh.studyfocus.config;

import lombok.RequiredArgsConstructor;
import org.devnqminh.studyfocus.model.NoteType;
import org.devnqminh.studyfocus.repository.NoteTypeRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final NoteTypeRepository noteTypeRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (noteTypeRepository.findByName("General").isEmpty()) {
            noteTypeRepository.save(NoteType.builder()
                    .name("General")
                    .status(1)
                    .build());
        }
    }
}
