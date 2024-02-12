import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";

interface NoteCardsProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDelete: (id: string) => void;
  theme: string;
}

export function NoteCards({ note, onNoteDelete, theme }: NoteCardsProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={`relative flex flex-col gap-3 overflow-hidden rounded-md p-5 text-left outline-none 
        hover:ring-2 hover:ring-gray-600 focus-visible:ring-2 focus-visible:ring-fuchsia-400 
        ${theme === "Modo Escuro" ? "bg-gray-700" : "bg-gray-300"}`}
      >
        <span
          className={`text-sm font-medium ${theme === "Modo Escuro" ? "text-gray-300" : "text-gray-800"}`}
        >
          {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
        </span>

        <p
          className={`text-sm leading-6 ${theme === "Modo Escuro" ? "text-gray-400" : "text-gray-700"}`}
        >
          {note.content}
        </p>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-950/60 to-gray-950/0" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          className={`fixed inset-0 flex w-full flex-col overflow-hidden outline-none 
          md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md
          ${theme === "Modo Escuro" ? "bg-gray-700" : "bg-gray-300"}`}
        >
          <Dialog.Close className="absolute right-0 top-0 bg-gray-800 p-1.5 text-gray-400 hover:text-gray-100">
            <X className="size-5" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <span
              className={`text-sm font-medium ${theme === "Modo Escuro" ? "text-gray-300" : "text-gray-800"}`}
            >
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>

            <p
              className={`text-sm leading-6 ${theme === "Modo Escuro" ? "text-gray-400" : "text-gray-700"}`}
            >
              {note.content}
            </p>
          </div>

          <button
            className="group w-full bg-gray-800 py-4 text-center text-sm font-medium text-gray-300 outline-none"
            onClick={() => onNoteDelete(note.id)}
          >
            Deseja{" "}
            <span className="text-red-400 group-hover:underline">
              apagar essa nota
            </span>
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
