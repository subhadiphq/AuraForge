export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center animate-pulse">
          <span className="text-white text-xl">✨</span>
        </div>
        <div className="loader" />
      </div>
    </div>
  )
}
