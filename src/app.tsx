import { ChangeEvent, useState } from "react";
import { NewNoteCards } from "./components/new-note-cards";
import { NoteCards } from "./components/note-cards";

interface NoteProps {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<NoteProps[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    return notesOnStorage !== null ? JSON.parse(notesOnStorage) : [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes([newNote, ...notes]);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDelete(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id;
    });

    setNotes(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : notes;

  return (
    <main className="mx-auto my-12 max-w-6xl space-y-6 px-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold capitalize text-gray-400">
          Quick audio Note
        </h2>

        <button className="rounded-md border px-3 py-1 font-medium transition-colors duration-200 ease-in hover:bg-white hover:text-gray-900j-">
          Dark Mode
        </button>
      </div>

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque sua nota..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-gray-500"
          onChange={(event) => handleSearch(event)}
        />
      </form>

      <div className="h-px bg-gray-700" />

      <div className="grid auto-rows-[250px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NewNoteCards onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => (
          <NoteCards key={note.id} note={note} onNoteDelete={onNoteDelete} />
        ))}
      </div>
    </main>
  );
}
