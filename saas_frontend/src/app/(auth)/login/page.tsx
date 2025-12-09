'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { CardTitle, CardDescription } from '@/components/ui/Card';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';
import { api } from '@/lib/api';
import { Org } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    orgName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    
    if (!validate()) return;

    setIsLoading(true);

    try {
      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Login failed. Please try again.');
      }

      // Handle Organization Context
      if (formData.orgName.trim()) {
        try {
          const orgs = await api.get<Org[]>('/orgs');
          const targetOrg = orgs.find(
            o => o.name.toLowerCase() === formData.orgName.trim().toLowerCase()
          );
          
          if (targetOrg) {
            localStorage.setItem('currentOrgId', targetOrg.id);
          } else {
            setGlobalError(
              `Organization "${formData.orgName}" not found or you don't have access. Continuing to dashboard...`
            );
            // Continue anyway after a brief delay
            setTimeout(() => {
              router.push('/dashboard');
            }, 2000);
            return;
          }
        } catch (err) {
          console.error('Failed to fetch organizations:', err);
          // Continue to dashboard even if org fetch fails
        }
      }

      // Successful login
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Handle specific error messages
        if (err.message.includes('Invalid login credentials')) {
          setGlobalError('Invalid email or password. Please try again.');
        } else if (err.message.includes('Email not confirmed')) {
          setGlobalError('Please verify your email address before logging in.');
        } else {
          setGlobalError(err.message);
        }
      } else {
        setGlobalError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to your account to continue
          </CardDescription>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <Input
              label="Email address"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              disabled={isLoading}
              autoComplete="email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Link 
                href="/forgot-password" 
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                tabIndex={-1}
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Optional Organization Section */}
          <div className="pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-3 py-1 text-gray-500 font-medium">
                  Optional
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              <Input
                label="Organization name"
                placeholder="e.g., Acme Corp"
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                disabled={isLoading}
                autoComplete="organization"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Leave blank to select after login
              </p>
            </div>
          </div>

          {/* Error Message */}
          {globalError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex gap-3">
                <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
                <p className="text-sm text-red-700 leading-relaxed">
                  {globalError}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold" 
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup" 
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}