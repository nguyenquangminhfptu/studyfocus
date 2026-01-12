import type { Note } from "../types/note";

type Props = {
  note: Note;
  onDelete: (id: string) => void;
};

export default function NoteItem({ note, onDelete }: Props) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700 }}>{note.title}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>{note.noteDate}</div>
        </div>

        <button onClick={() => onDelete(note.id)}>Delete</button>
      </div>

      <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{note.content}</div>
    </div>
  );
}
