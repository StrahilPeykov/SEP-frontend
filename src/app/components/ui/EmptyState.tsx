export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center text-gray-500" role="status" aria-live="polite">
      <p className="text-lg">{message}</p>
    </div>
  );
}
