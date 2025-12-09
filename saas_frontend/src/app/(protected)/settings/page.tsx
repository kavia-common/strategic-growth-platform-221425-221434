'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabaseClient';
import { UserProfile } from '@/types';

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        setProfile({
            id: session.user.id,
            email: session.user.email || '',
        });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                {profile?.email?.[0]?.toUpperCase()}
            </div>
            <div>
                <p className="font-medium">{profile?.email}</p>
                <p className="text-sm text-gray-500">User ID: {profile?.id}</p>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Input label="Full Name" placeholder="Enter your full name" />
          </div>
          
          <Button variant="outline">Update Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
           <CardTitle>Organization Settings</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-gray-500 text-sm mb-4">
                Current Organization ID: {typeof window !== 'undefined' ? localStorage.getItem('currentOrgId') : ''}
            </p>
            <Button variant="outline">Manage Members</Button>
        </CardContent>
      </Card>
    </div>
  );
}
