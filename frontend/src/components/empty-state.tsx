type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
      <p className="font-medium text-slate-900">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">{description}</p>
      )}
    </div>
  );
}
