import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-6 max-w-2xl px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
          Strategic Growth Platform
        </h1>
        <p className="text-xl text-gray-600">
          The enterprise-grade SaaS solution for scaling your organization.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
