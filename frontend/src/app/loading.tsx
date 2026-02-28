export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-brand border-t-transparent animate-spin" aria-hidden />
        <p className="text-slate-600 text-sm">Loading…</p>
      </div>
    </div>
  );
}
