import { http } from "./http";
import type { Note } from "../types/note";

// Get all notes
export async function getNotes(): Promise<Note[]> {
    const res = await http.get<Note[]>("/notes");
    return res.data;
}

// Create a new note
export async function createNote(note: Note): Promise<Note> {
    const res = await http.post<Note>("/notes", note);
    return res.data;
}

// Delete a note
export async function deleteNoteApi(id: string): Promise<void> {
    await http.delete(`/notes/${id}`);
}
