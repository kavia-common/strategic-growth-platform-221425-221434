'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Org } from '@/types';
import { Building2, ArrowRight } from 'lucide-react';

export default function OrgSwitchPage() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Org[]>([]);

  useEffect(() => {
    api.get<Org[]>('/orgs').then(setOrgs).catch(console.error);
  }, []);

  const handleSelect = (orgId: string) => {
    localStorage.setItem('currentOrgId', orgId);
    router.push('/dashboard');
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Select Organization</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {orgs.map((org) => (
          <Card 
            key={org.id} 
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => handleSelect(org.id)}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">{org.name}</h3>
                  <p className="text-sm text-gray-500">{org.slug}</p>
                </div>
              </div>
              <ArrowRight className="text-gray-300" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button onClick={() => router.push('/orgs/new')}>Create New Organization</Button>
      </div>
    </div>
  );
}
