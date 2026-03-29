package org.devnqminh.studyfocus.repository;

import org.devnqminh.studyfocus.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUser_Id(Long userId);
}
