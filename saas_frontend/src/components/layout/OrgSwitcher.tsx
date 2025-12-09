'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Org } from '@/types';

export function OrgSwitcher() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Org | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadOrgs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrgs = async () => {
    try {
      const data = await api.get<Org[]>('/orgs');
      setOrgs(data);

      const savedOrgId = localStorage.getItem('currentOrgId');
      if (savedOrgId) {
        const found = data.find(o => o.id === savedOrgId);
        if (found) setCurrentOrg(found);
        else if (data.length > 0) selectOrg(data[0]);
      } else if (data.length > 0) {
        selectOrg(data[0]);
      }
    } catch (error) {
      console.error('Failed to load orgs:', error);
    }
  };

  const selectOrg = (org: Org) => {
    setCurrentOrg(org);
    localStorage.setItem('currentOrgId', org.id);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="w-full justify-between px-2 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2 truncate">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white text-xs">
            {currentOrg ? currentOrg.name[0].toUpperCase() : <Building2 size={14} />}
          </div>
          <span className="truncate max-w-[120px]">
            {currentOrg ? currentOrg.name : 'Select Org'}
          </span>
        </span>
        <ChevronDown size={14} className="opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full min-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg py-1">
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
            Organizations
          </div>
          {orgs.map((org) => (
            <button
              key={org.id}
              onClick={() => selectOrg(org)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-left"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-xs">
                {org.name[0].toUpperCase()}
              </div>
              <span className="truncate">{org.name}</span>
            </button>
          ))}
          <div className="border-t border-gray-100 my-1"></div>
          <button
             onClick={() => router.push('/orgs/new')}
             className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-primary"
          >
            <Plus size={14} />
            <span>Create Organization</span>
          </button>
        </div>
      )}
    </div>
  );
}
