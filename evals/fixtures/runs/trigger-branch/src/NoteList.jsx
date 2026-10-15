import { useEffect, useState } from "react";

export function NoteList({ store, tag }) {
  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`/api/notes?tag=${tag}`)
      .then((r) => r.json())
      .then((data) => {
        setNotes(data);
        setCount(data.length);
      });
  }, []);

  return (
    <ul>
      {notes.map((n, i) => (
        <li key={i} onClick={() => store.open(n.id)}>{n.text}</li>
      ))}
      <li>{count} notes</li>
    </ul>
  );
}
