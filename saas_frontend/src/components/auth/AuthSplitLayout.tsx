'use client';

import React from 'react';
import { Rocket, TrendingUp, ShieldCheck } from 'lucide-react';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  image?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Panel - Illustration & Mission */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90 z-0"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
               <TrendingUp size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Strategic Growth</span>
          </div>
          
          <div className="space-y-6 mt-20">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
              Scale your organization <br/> with confidence.
            </h1>
            <p className="text-blue-100 text-lg max-w-md leading-relaxed">
              The complete platform for managing teams, tracking metrics, and driving strategic initiatives forward.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-8 mt-auto">
           <div className="space-y-2">
              <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                 <Rocket size={20} />
              </div>
              <h3 className="font-semibold">Fast Deployment</h3>
              <p className="text-sm text-blue-100 opacity-80">Launch in minutes, not months.</p>
           </div>
           <div className="space-y-2">
              <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                 <ShieldCheck size={20} />
              </div>
              <h3 className="font-semibold">Enterprise Security</h3>
              <p className="text-sm text-blue-100 opacity-80">Bank-grade protection for your data.</p>
           </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-gray-50/50">
        <div className="w-full max-w-md space-y-8">
           {children}
        </div>
      </div>
    </div>
  );
}
