export default function PagesLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="border rounded-md">
        <div className="h-12 bg-gray-100 border-b flex items-center px-4">
          <div className="grid grid-cols-6 w-full gap-4">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
          </div>
        </div>

        {Array(5)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="h-16 border-b flex items-center px-4">
              <div className="grid grid-cols-6 w-full gap-4">
                {Array(6)
                  .fill(null)
                  .map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
