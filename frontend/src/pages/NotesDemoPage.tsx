import { useEffect, useMemo, useState } from "react";
import NoteItem from "../components/NoteItem";
import type { Note } from "../types/note";
import { pingBackend } from "../api/ping";
import { getNotes, createNote, deleteNoteApi } from "../api/note";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function NotesDemoPage() {
  // STATE
  const [date, setDate] = useState(today());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [notes, setNotes] = useState<Note[]>([]);
  const [pingMsg, setPingMsg] = useState<string>("(not pinged yet)");

  // EFFECT: Fetch notes from backend on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes", error);
    }
  }

  // Memo: list note theo ngày
  const notesOfSelectedDate = useMemo(() => {
    return notes.filter((n) => n.noteDate === date).sort((a, b) => b.createdAt - a.createdAt);
  }, [notes, date]);

  async function addNote() {
    if (!title.trim()) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      noteDate: date,
      title: title.trim(),
      content: content.trim(),
      createdAt: Date.now(),
    };

    try {
      const savedNote = await createNote(newNote);
      setNotes((prev) => [savedNote, ...prev]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to save note", error);
      alert("Error saving note to backend");
    }
  }

  async function deleteNote(id: string) {
    try {
      await deleteNoteApi(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to delete note", error);
      alert("Error deleting note");
    }
  }

  async function onPing() {
    try {
      const msg = await pingBackend();
      setPingMsg(msg);
    } catch (e) {
      setPingMsg("Ping failed (check backend & proxy)");
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1 style={{ marginBottom: 6 }}>StudyFocus — Notes Demo</h1>
      <div style={{ opacity: 0.8, marginBottom: 16 }}>
        This demo teaches: state, props, list render, and calling backend API.
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label>
          Date:{" "}
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <button onClick={onPing}>Ping Backend</button>
        <span style={{ fontSize: 13, opacity: 0.75 }}>Ping result: {pingMsg}</span>
      </div>

      <hr style={{ margin: "16px 0" }} />

      {/* Add note form */}
      <div style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={addNote}>Add Note</button>
          <button onClick={() => { setTitle(""); setContent(""); }}>Clear</button>
        </div>
      </div>

      <hr style={{ margin: "16px 0" }} />

      {/* Notes list */}
      <h2 style={{ marginBottom: 10 }}>Notes of {date} ({notesOfSelectedDate.length})</h2>

      {notesOfSelectedDate.length === 0 ? (
        <div style={{ opacity: 0.7 }}>No notes for this date yet.</div>
      ) : (
        notesOfSelectedDate.map((n) => (
          <NoteItem key={n.id} note={n} onDelete={deleteNote} />
        ))
      )}
    </div>
  );
}
