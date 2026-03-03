type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="glass-card rounded-2xl p-8 text-center">
      <p className="font-medium text-white">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-white/70 max-w-md mx-auto">{description}</p>
      )}
    </div>
  );
}
