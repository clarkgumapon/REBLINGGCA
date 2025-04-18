export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    </div>
  )
} 