import { ChangeEvent, MouseEvent, useState } from "react";
import { NewNoteCards } from "./components/new-note-cards";
import { NoteCards } from "./components/note-cards";
import { ChevronDown } from "lucide-react";

interface NoteProps {
  id: string;
  date: Date;
  content: string;
}

type ThemeProps = string;

export function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<NoteProps[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");
    return notesOnStorage !== null ? JSON.parse(notesOnStorage) : [];
  });

  const [theme, setTheme] = useState<ThemeProps>(() => {
    const themeStorage = localStorage.getItem("theme");
    return themeStorage !== null ? themeStorage : "Modo Escuro";
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

  function handleIsOpenCombox() {
    setIsOpen(!isOpen);
  }

  function handleChangeTheme(value: MouseEvent<HTMLButtonElement>) {
    setTheme(value.currentTarget.value);
    setIsOpen(false);

    localStorage.setItem("theme", value.currentTarget.value);
  }

  if (theme === "Modo Escuro") {
    document.body.style.backgroundColor = "rgb(17,24,39,1)";
    document.body.style.transition = "background-color 0.5s";
    document.body.style.color = "rgb(249,250,251,1)";
  } else {
    document.body.style.backgroundColor = "rgb(243,244,246,1";
    document.body.style.transition = "background-color 0.5s";
    document.body.style.color = "rgb(17,24,39,1)";
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : notes;

  return (
    <main className="mx-auto my-12 max-w-6xl space-y-6 px-5">
      <div className="flex justify-end">
        <button
          className="flex items-center gap-1 rounded-md border px-3 py-1 font-medium transition-colors duration-200 ease-in 
          hover:bg-white hover:text-gray-900"
          onClick={handleIsOpenCombox}
        >
          {theme}
          <ChevronDown className="size-5 pt-1" />
        </button>

        <div
          className={`absolute top-24 hidden h-[0px] w-[150px] flex-col items-center justify-center overflow-hidden rounded-md transition 
          data-[open=true]:flex data-[open=true]:h-[80px] ${theme === "Modo Escuro" ? "bg-gray-800" : "bg-gray-100"}`}
          data-open={isOpen}
        >
          <button
            type="button"
            className={`w-full p-2 ${theme === "Modo Escuro" && "bg-gray-500"}`}
            value="Modo Escuro"
            onClick={(value) => handleChangeTheme(value)}
          >
            Modo Escuro
          </button>
          <button
            type="button"
            className={`w-full p-2 ${theme === "Modo Claro" && "bg-gray-300"}`}
            value="Modo Claro"
            onClick={(value) => handleChangeTheme(value)}
          >
            Modo Claro
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold capitalize text-gray-400">
          Quick audio Note
        </h2>
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
        <NewNoteCards onNoteCreated={onNoteCreated} theme={theme} />

        {filteredNotes.map((note) => (
          <NoteCards
            key={note.id}
            note={note}
            onNoteDelete={onNoteDelete}
            theme={theme}
          />
        ))}
      </div>
    </main>
  );
}
