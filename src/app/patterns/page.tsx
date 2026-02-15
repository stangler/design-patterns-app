import { designPatterns } from '@/utils/patterns';

export default function PatternsPage() {
  const patterns = designPatterns;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            デザインパターン一覧
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            すべてのデザインパターンを探索しましょう
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {patterns.map((pattern) => (
            <div
              key={pattern.id}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {pattern.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {pattern.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                  {pattern.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {pattern.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}