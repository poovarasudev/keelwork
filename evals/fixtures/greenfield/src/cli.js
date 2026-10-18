#!/usr/bin/env node
// notes add <text> | notes list | notes delete <id>
import { homedir } from "node:os";
import { join } from "node:path";
import { addNote, deleteNote, listNotes } from "./notes.js";

const STORE = process.env.NOTES_FILE ?? join(homedir(), ".notes.json");

export function run(argv, store = STORE) {
  const [command, ...rest] = argv;
  switch (command) {
    case "add": {
      const note = addNote(store, rest.join(" "));
      return `Added note ${note.id}.`;
    }
    case "list": {
      const notes = listNotes(store);
      if (notes.length === 0) return "No notes yet.";
      return notes.map((n) => `${n.id}. ${n.text}`).join("\n");
    }
    case "delete": {
      deleteNote(store, Number(rest[0]));
      return `Deleted note ${rest[0]}.`;
    }
    default:
      return "Usage: notes add <text> | notes list | notes delete <id>";
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    console.log(run(process.argv.slice(2)));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
