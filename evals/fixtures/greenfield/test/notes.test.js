import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { run } from "../src/cli.js";
import { addNote, deleteNote, listNotes } from "../src/notes.js";

const freshStore = () => join(mkdtempSync(join(tmpdir(), "notes-")), "notes.json");

test("adds and lists notes in order", () => {
  const store = freshStore();
  addNote(store, "first");
  addNote(store, "second");
  assert.deepEqual(listNotes(store).map((n) => n.text), ["first", "second"]);
});

test("rejects an empty note", () => {
  assert.throws(() => addNote(freshStore(), "   "), /needs some text/);
});

test("deletes a note by id", () => {
  const store = freshStore();
  const note = addNote(store, "doomed");
  deleteNote(store, note.id);
  assert.equal(listNotes(store).length, 0);
});

test("deleting a missing note fails", () => {
  assert.throws(() => deleteNote(freshStore(), 99), /No note with id 99/);
});

test("cli list shows an empty state", () => {
  assert.equal(run(["list"], freshStore()), "No notes yet.");
});
