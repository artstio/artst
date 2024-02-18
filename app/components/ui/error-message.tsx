export function ErrorMessage({ message }: { message: React.ReactNode }) {
  return <p className="text-sm text-destructive">{message}</p>;
}
