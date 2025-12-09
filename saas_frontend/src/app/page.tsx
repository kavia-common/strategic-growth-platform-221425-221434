import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Blobs */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-violet-400/15 to-fuchsia-400/15 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-blue-300/20 rounded-3xl rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-40 left-32 w-24 h-24 border border-indigo-300/20 rounded-full animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">S</span>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 tracking-tight">Strategic</span>
                <span className="text-xs text-gray-500 font-medium">by Innovate Corp</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <Link 
                href="/pricing" 
                className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors hidden md:block"
              >
                Pricing
              </Link>
              <Link 
                href="/about" 
                className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors hidden md:block"
              >
                About
              </Link>
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors relative group"
              >
                Sign In
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-16">
        <div className="relative z-10 text-center space-y-10 max-w-6xl">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-up">
            <div className="relative">
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-ping absolute"></span>
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full relative"></span>
            </div>
            <span className="text-sm font-semibold text-gray-800 tracking-wide">
              Enterprise-grade • Trusted by <span className="text-blue-600">500+</span> companies
            </span>
            <span className="w-6 h-px bg-gradient-to-r from-gray-300 to-transparent"></span>
            <span className="text-xs text-gray-500 font-medium">Join the movement →</span>
          </div>

          {/* Main Headline with Typing Effect */}
          <div className="space-y-4 animate-fade-up animation-delay-100">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-tight">
              Strategic Growth
              <span className="block mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            {/* Animated Underline */}
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto opacity-80"></div>
          </div>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-up animation-delay-200">
            The all-in-one platform for scaling your organization with{' '}
            <span className="text-gray-900 font-semibold relative">
              data-driven insights
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full"></span>
            </span>
            {' '}and{' '}
            <span className="text-gray-900 font-semibold relative">
              collaborative workflows
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-purple-400/30 to-fuchsia-400/30 rounded-full"></span>
            </span>
            .
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8 animate-fade-up animation-delay-300">
            <Link 
              href="/signup" 
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center gap-3">
                Get Started Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link 
              href="#demo" 
              className="group relative px-10 py-5 bg-white/90 backdrop-blur-sm border-2 border-gray-300/50 text-gray-800 font-semibold text-lg rounded-xl hover:bg-white hover:border-gray-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-2xl mx-auto animate-fade-up animation-delay-400">
            <div className="text-center p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">99.9%</div>
              <div className="text-sm text-gray-600 mt-1">Uptime</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">4.9★</div>
              <div className="text-sm text-gray-600 mt-1">Rating</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">2.5x</div>
              <div className="text-sm text-gray-600 mt-1">Growth</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-gray-600 mt-1">Support</div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="relative z-10 mt-32 mb-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full animate-fade-up animation-delay-500">
          {[
            {
              icon: "📊",
              title: "Analytics & Insights",
              description: "Real-time data visualization and predictive analytics with AI-powered recommendations",
              gradient: "from-blue-500 to-cyan-500",
              bg: "bg-blue-50",
              delay: "0"
            },
            {
              icon: "🤝",
              title: "Team Collaboration",
              description: "Seamless workflows for distributed teams with integrated communication tools",
              gradient: "from-indigo-500 to-purple-500",
              bg: "bg-indigo-50",
              delay: "100"
            },
            {
              icon: "🔒",
              title: "Enterprise Security",
              description: "Bank-level encryption, compliance certifications, and advanced threat detection",
              gradient: "from-purple-500 to-pink-500",
              bg: "bg-purple-50",
              delay: "200"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-up animation-delay-${feature.delay}`}
            >
              {/* Hover Effect Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
                    Learn more
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="relative z-10 mt-20 mb-20 text-center animate-fade-up animation-delay-600">
          <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl p-12 max-w-4xl mx-auto border border-gray-200/50">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to transform your business?</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of companies already using Strategic to drive their growth.
            </p>
            <Link 
              href="/enterprise" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Schedule Enterprise Demo
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

     
    </div>
  );
}