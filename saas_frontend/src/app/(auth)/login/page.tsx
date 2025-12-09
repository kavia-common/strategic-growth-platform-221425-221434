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
    orgName: '' // Optional for login context
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    if (!validate()) return;

    setIsLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Handle Organization Context
      if (formData.orgName) {
         try {
           // Attempt to find the org in user's orgs
           const orgs = await api.get<Org[]>('/orgs');
           const targetOrg = orgs.find(o => o.name.toLowerCase() === formData.orgName.toLowerCase());
           
           if (targetOrg) {
             localStorage.setItem('currentOrgId', targetOrg.id);
           } else {
             // Org provided but not found/authorized - warn but don't block
             console.warn('Organization not found or access denied');
             // Optionally set error: setGlobalError(`Could not sign into organization "${formData.orgName}"`);
             // But we allow login anyway
           }
         } catch (err) {
           console.error('Failed to fetch orgs during login', err);
         }
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGlobalError(err.message);
      } else {
        setGlobalError('Failed to login. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center sm:text-left">
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />
          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          <div className="flex justify-end">
            <Link href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="relative my-4">
             <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t border-gray-200" />
             </div>
             <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-gray-50 px-2 text-gray-500">Optional</span>
             </div>
          </div>
          
          <Input
            label="Organization Name"
            placeholder="e.g. Acme Corp"
            value={formData.orgName}
            onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
            error={errors.orgName}
          />

          {globalError && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-100 flex items-center gap-2">
              <span>⚠️</span>
              {globalError}
            </div>
          )}

          <Button type="submit" className="w-full h-11 text-base" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
