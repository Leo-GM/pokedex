export function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full bg-zinc-900 px-5 py-2 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900"
    >
      {message}
    </div>
  );
}
