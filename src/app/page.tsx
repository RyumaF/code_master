import ChordGame from "@/src/components/ChordGame";

/**
 * Root page — server component shell.
 * All interactivity lives in ChordGame (client component boundary).
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-studio-bg bg-dot-grid bg-dot-24">
      <ChordGame />
    </main>
  );
}
