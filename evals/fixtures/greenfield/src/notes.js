// A notebook stored as one JSON file. Every function takes the store path, so
// tests can point it at a temporary file.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

function load(path) {
  if (!existsSync(path)) return { nextId: 1, notes: [] };
  return JSON.parse(readFileSync(path, "utf8"));
}

function save(path, book) {
  writeFileSync(path, JSON.stringify(book, null, 2));
}

export function addNote(path, text) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) throw new Error("A note needs some text.");
  const book = load(path);
  const note = { id: book.nextId, text: trimmed, createdAt: new Date().toISOString() };
  book.nextId += 1;
  book.notes.push(note);
  save(path, book);
  return note;
}

export function listNotes(path) {
  return load(path).notes;
}

export function deleteNote(path, id) {
  const book = load(path);
  const before = book.notes.length;
  book.notes = book.notes.filter((n) => n.id !== id);
  if (book.notes.length === before) throw new Error(`No note with id ${id}.`);
  save(path, book);
}
