export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold">Hors connexion</h1>
      <p className="mt-4 text-lg text-zinc-400">
        Pas de connexion internet. Vos données sont sauvegardées localement.
      </p>
    </main>
  );
}
