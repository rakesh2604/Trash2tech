export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-eco border-t-transparent animate-spin" aria-hidden />
        <p className="text-white/70 text-sm">Loading…</p>
      </div>
    </div>
  );
}
