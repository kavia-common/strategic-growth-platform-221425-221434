'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Select } from '@/components/ui/Select';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { CardTitle, CardDescription } from '@/components/ui/Card';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';
import { api } from '@/lib/api';
import { Org } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    orgName: '',
    role: 'owner',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, - and _';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Organization name validation (optional but validate if provided)
    if (formData.orgName && formData.orgName.length < 2) {
      newErrors.orgName = 'Organization name must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    
    if (!validate()) return;

    setIsLoading(true);

    try {
      // 1. Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            username: formData.username.trim(),
            full_name: formData.username.trim(),
            role: formData.role
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Sign up failed. Please try again.');
      }

      // Check if email confirmation is required
      if (!authData.session) {
        setSuccess(true);
        return;
      }

      // 2. If Org Name provided and session exists, create Organization
      if (formData.orgName.trim() && authData.session) {
        try {
          const slug = formData.orgName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          const newOrg = await api.post<Org>('/orgs', { 
            name: formData.orgName.trim(),
            slug: slug
          });
          
          if (newOrg?.id) {
            localStorage.setItem('currentOrgId', newOrg.id);
          }
        } catch (orgErr) {
          console.error('Organization creation failed:', orgErr);
          setGlobalError(
            'Account created successfully, but failed to create organization. You can create one from the dashboard.'
          );
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
          return;
        }
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Handle specific error messages
        if (err.message.includes('already registered')) {
          setGlobalError('This email is already registered. Please sign in instead.');
        } else if (err.message.includes('Invalid email')) {
          setGlobalError('Please enter a valid email address.');
        } else if (err.message.includes('Password should be')) {
          setGlobalError('Password does not meet requirements. Please choose a stronger password.');
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

  if (success) {
    return (
      <AuthSplitLayout>
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">✓</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
            <p className="text-gray-600">
              We&apos;ve sent a verification link to <span className="font-semibold">{formData.email}</span>
            </p>
            <p className="text-sm text-gray-500 pt-2">
              Click the link in the email to verify your account and complete signup.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/login')} 
            className="w-full"
            size="lg"
            variant="outline"
          >
            Go to Login
          </Button>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription className="text-base">
            Get started with your free account in minutes
          </CardDescription>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-8">
          {/* User Details Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Your Details
              </h3>
            </div>
            
            <div className="space-y-4 pl-10">
              <Input
                label="Username"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  if (errors.username) setErrors({ ...errors, username: '' });
                }}
                error={errors.username}
                disabled={isLoading}
                autoComplete="username"
                required
              />
              
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <PasswordInput
                    label="Password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    error={errors.password}
                    disabled={isLoading}
                    autoComplete="new-password"
                    required
                  />
                  {formData.password && (
                    <div className="mt-2">
                      <PasswordStrength password={formData.password} />
                    </div>
                  )}
                </div>
                
                <PasswordInput
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  error={errors.confirmPassword}
                  disabled={isLoading}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Organization Details Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Organization Details
              </h3>
              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                Optional
              </span>
            </div>
            
            <div className="space-y-4 pl-10">
              <p className="text-sm text-gray-600">
                Create an organization now or do it later from your dashboard
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Organization Name"
                  placeholder="Acme Inc."
                  value={formData.orgName}
                  onChange={(e) => {
                    setFormData({ ...formData, orgName: e.target.value });
                    if (errors.orgName) setErrors({ ...errors, orgName: '' });
                  }}
                  error={errors.orgName}
                  disabled={isLoading}
                  autoComplete="organization"
                />
                
                <Select 
                  label="Your Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  options={[
                    { label: 'Owner', value: 'owner' },
                    { label: 'Admin', value: 'admin' },
                    { label: 'Member', value: 'member' }
                  ]}
                  disabled={isLoading}
                />
              </div>
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
            className="w-full font-semibold shadow-lg" 
            size="lg"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500 leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </form>

        {/* Sign In Link */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}