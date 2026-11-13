export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-organic border border-dashed border-moss/30 bg-cream/50 p-8 text-center text-foreground-alt/70">
      {message}
    </div>
  );
}
