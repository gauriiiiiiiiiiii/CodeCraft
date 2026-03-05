import EditorPanel from "./_components/EditorPanel";
import Header from "./_components/Header";
import OutputPanel from "./_components/OutputPanel";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-[1800px] flex-1 min-h-0 flex-col p-4">
        <Header />

        <div className="grid flex-1 min-h-0 grid-cols-1 gap-4 lg:grid-cols-2">
          <EditorPanel />
          <OutputPanel />
        </div>
      </div>
    </div>
  );
}
