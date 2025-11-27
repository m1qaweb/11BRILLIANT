import Link from 'next/link'

export const metadata = {
  title: 'ელ. ფოსტის დადასტურება - გონი',
  description: 'შეამოწმეთ თქვენი ელ. ფოსტა ანგარიშის დასადასტურებლად',
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const params = await searchParams
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Success Message */}
        {params.success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border-2 border-green-200 animate-slide-up">
            <p className="text-sm font-semibold text-green-800 georgian-body text-center">
              ✅ {decodeURIComponent(params.success)}
            </p>
          </div>
        )}
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 georgian-heading">
          შეამოწმეთ თქვენი ელ. ფოსტა
        </h2>
        <p className="mt-4 text-center text-gray-600 georgian-body">
          ჩვენ გამოგიგზავნეთ დადასტურების ბმული. გთხოვთ, შეამოწმოთ თქვენი ელ. ფოსტა და დააწკაპუნოთ ბმულზე თქვენი ანგარიშის დასადასტურებლად.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-200">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700 georgian-body">
                  <strong>არ მოგივიდათ ელ. ფოსტა?</strong>
                  <br />
                  შეამოწმეთ სპამის საქაღალდე ან დაუკავშირდით მხარდაჭერას.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700 georgian-body">
                  დადასტურების ბმული ვრცელდება 24 საათის განმავლობაში.
                  <br />
                  <span className="text-xs text-gray-500 mt-1 block">
                    ელ. ფოსტის მიღება შეიძლება გაიჭიანოს 2-3 წუთით.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center relative z-20">
          <Link 
            href="/" 
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors georgian-body inline-flex items-center gap-2 hover:gap-3 transition-all"
          >
            ← მთავარ გვერდზე დაბრუნება
          </Link>
        </div>
      </div>
    </div>
  )
}
