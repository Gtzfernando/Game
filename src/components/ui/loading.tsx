export function Loading({ message = "Cargando..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-moss border-t-transparent" />
      <p className="mt-4 text-foreground-alt">{message}</p>
    </div>
  );
}
