
export default function Toast({ type, message }: { type: string, message: string }) {
  return (
    <div className={type.toLocaleLowerCase() === 'success' ? 'text-green-700 border-2 border-green-700 bg-green-500 p-5 rounded-md z-20' : 'text-red-700 border-2 border-red-600 bg-red-400 p-5 rounded-md z-20'}>
      {message}
    </div>
  );
}
