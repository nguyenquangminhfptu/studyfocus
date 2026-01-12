import React from "react";
import type { User } from "../types";

export default function Home() {
  const user: User | null = null;

  return (
    <main style={{ padding: 16 }}>
      <h2>Home</h2>
      <p>Welcome to StudyFocus — demo page.</p>
      {user ? <p>Signed in as {user.name}</p> : <p>Not signed in</p>}
    </main>
  );
}
