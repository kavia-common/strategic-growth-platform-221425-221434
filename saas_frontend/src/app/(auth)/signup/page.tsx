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
    orgName: '',
    role: 'owner', // Default role
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    // Org name is optional, but if role is owner/admin maybe it makes sense to require it? 
    // Prompt says "create org via backend if organization name provided".
    
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
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            full_name: formData.username, // Using username as full name initially
            role: formData.role
          }
        }
      });

      if (authError) throw authError;

      // 2. If Org Name provided, create Organization
      if (formData.orgName && authData.session) {
         try {
           // We need to wait for the user record to be fully available/trigger logic might run on backend.
           // Assuming we can immediately call API with the new session token.
           // The session is returned in authData if email confirmation is disabled or auto-confirmed.
           // If email confirmation is required, this step might fail or need to happen after login.
           
           if (!authData.session) {
             // Email confirmation case
             setSuccess(true);
             setIsLoading(false);
             return;
           }

           // Create Org
           const newOrg = await api.post<Org>('/orgs', { 
              name: formData.orgName,
              slug: formData.orgName.toLowerCase().replace(/[^a-z0-9]/g, '-') 
           });
           
           if (newOrg && newOrg.id) {
             localStorage.setItem('currentOrgId', newOrg.id);
           }
         } catch (orgErr) {
           console.error("Organization creation failed", orgErr);
           // We don't block signup success but warn user
           setGlobalError("Account created, but failed to create organization. You can create one later.");
           // Proceed to dashboard anyway
         }
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGlobalError(err.message);
      } else {
        setGlobalError('Failed to sign up');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthSplitLayout>
         <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Account Created!</h2>
            <p className="text-gray-600">Please check your email to verify your account before logging in.</p>
            <Button onClick={() => router.push('/login')} className="w-full">Go to Login</Button>
         </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center sm:text-left">
          <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
          <CardDescription>
             Get started with your free organization account today.
          </CardDescription>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* User Info Section */}
          <div className="space-y-4">
             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">User Details</h3>
             <Input
              label="Username"
              placeholder="jdoe"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              error={errors.username}
            />
            <Input
              label="Email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />
            <div>
              <PasswordInput
                label="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />
              <PasswordStrength password={formData.password} />
            </div>
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Organization Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Organization Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Organization Name"
                    placeholder="Acme Inc."
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    error={errors.orgName}
                />
                <Select 
                    label="Role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    options={[
                        { label: 'Owner', value: 'owner' },
                        { label: 'Admin', value: 'admin' },
                        { label: 'Member', value: 'member' }
                    ]}
                />
            </div>
          </div>

          {globalError && (
             <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-100 flex items-center gap-2">
              <span>⚠️</span>
              {globalError}
            </div>
          )}

          <Button type="submit" className="w-full h-11 text-base" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
