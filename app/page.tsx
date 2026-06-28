export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome back 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Progress */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg mb-4">Progress</h2>

          <div className="mb-3">
            <p className="text-sm">Algorithms</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-blue-600 h-2 rounded-full w-2/3"></div>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm">Binary</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-blue-600 h-2 rounded-full w-4/5"></div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg mb-4">Continue Learning</h2>

          <button className="w-full bg-blue-600 text-white py-2 rounded-xl mb-2">
            Binary Numbers
          </button>

          <button className="w-full bg-blue-600 text-white py-2 rounded-xl">
            Sorting Algorithms
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg mb-4">Quick Actions</h2>

          <button className="w-full bg-green-500 text-white py-2 rounded-xl mb-2">
            Start Quiz
          </button>

          <button className="w-full bg-yellow-500 text-white py-2 rounded-xl">
            Trace Table Practice
          </button>
        </div>

      </div>
    </div>
  );
}