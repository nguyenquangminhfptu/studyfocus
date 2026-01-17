//package org.devnqminh.studyfocus.controller;
//
//import lombok.RequiredArgsConstructor;
//import org.devnqminh.studyfocus.entity.Note;
//import org.devnqminh.studyfocus.repository.NoteRepository;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/notes")
//@RequiredArgsConstructor
//public class NoteController {
//    private final NoteRepository noteRepository;
//
//    @GetMapping
//    public List<Note> getAllNotes() {
//        return noteRepository.findAll(); // In real app, consider pagination or filtering by user/date
//    }
//
//    @PostMapping
//    public Note createNote(@RequestBody Note note) {
//        return noteRepository.save(note);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteNote(@PathVariable String id) {
//        noteRepository.deleteById(id);
//    }
//}
