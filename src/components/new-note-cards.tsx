import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardsProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCards({ onNoteCreated }: NewNoteCardsProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState("");

  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
    if (event.target.value === "") {
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (content === "") {
      toast.warning(
        "Não pode salvar um campo vazio, por favor escreva uma nota!",
      );
      return;
    }

    onNoteCreated(content);

    setContent("");
    setShouldShowOnboarding(true);

    toast.success("Nota criada com sucesso!!");
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      toast.error(
        "Infelizmente seu Navegador não suporta a funcionalidade de gravação!!",
      );
      return;
    }
    setIsRecording(true);
    setShouldShowOnboarding(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    //Alternativas das palavras que ele acha que pode ser
    speechRecognition.maxAlternatives = 1;
    //Traz os resultados conforme falando e não só quando parar de falar
    speechRecognition.interimResults = true;

    // Chamado toda vez que OUVIR algo
    speechRecognition.onresult = (event) => {
      const trasncription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContent(trasncription);
    };

    //Chamado quando ouver um erro
    speechRecognition.onerror = (event) => {
      console.error(event.error);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) speechRecognition.stop();
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="flex flex-col gap-3 rounded-md bg-gray-700 p-5 text-left outline-none 
        hover:ring-2 hover:ring-gray-600 focus-visible:ring-2 focus-visible:ring-fuchsia-400"
      >
        <span className="text-sm font-medium text-gray-200">
          Adicionar notas
        </span>
        <p className="text-sm leading-6 text-gray-400">
          Grave uma nota em áudio que será convertido em texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          className="fixed inset-0 flex w-full flex-col overflow-hidden bg-gray-700 outline-none 
          md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md"
        >
          <Dialog.Close className="absolute right-0 top-0 bg-gray-800 p-1.5 text-gray-400 hover:text-gray-100">
            <X className="size-5" />
          </Dialog.Close>

          <form
            onSubmit={(event) => handleSaveNote(event)}
            className="flex flex-1 flex-col"
          >
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-gray-200">
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-gray-400">
                  Comece{" "}
                  <button
                    onClick={handleStartRecording}
                    className="font-medium text-green-500 hover:underline"
                  >
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    className="font-medium text-green-500 hover:underline"
                    onClick={handleStartEditor}
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="flex-1 resize-none bg-transparent text-sm leading-6 text-gray-300 outline-none"
                  onChange={(event) => handleContentChange(event)}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                className="group flex w-full items-center justify-center gap-2 bg-gray-900 py-4 text-center text-sm font-medium text-gray-300 
                outline-none transition-colors hover:text-gray-200"
                onClick={handleStopRecording}
              >
                <div className="flex size-5 items-center justify-center rounded-full border border-red-500">
                  <div className="size-2 animate-pulse rounded-sm bg-red-600" />
                </div>
                Gravando: (clique para interromper)
              </button>
            ) : (
              <button
                type="submit"
                className="group w-full bg-green-600 py-4 text-center text-sm font-medium text-gray-300 outline-none 
                transition-colors hover:bg-green-700 hover:text-gray-200"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
