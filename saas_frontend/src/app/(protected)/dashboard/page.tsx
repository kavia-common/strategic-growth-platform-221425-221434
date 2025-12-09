'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import { Metric } from '@/types';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Loading } from '@/components/ui/Loading';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchMetrics = async () => {
    try {
      const orgId = localStorage.getItem('currentOrgId');
      if (!orgId) return;

      const data = await api.get<Metric[]>(`/metrics/summary?orgId=${orgId}`);
      setMetrics(data || []);
    } catch (err) {
      console.error('Failed to fetch metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    const orgId = localStorage.getItem('currentOrgId');
    if (!orgId) return;

    const channel = supabase
      .channel(`dashboard_metrics:${orgId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'metrics',
        filter: `org_id=eq.${orgId}` 
      }, (payload) => {
        console.log('Realtime update:', payload);
        fetchMetrics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <Loading />;

  const displayMetrics = metrics.length > 0 ? metrics : [
    { id: '1', name: 'Total Revenue', value: 45231, change: 20.1, trend: 'up', period: 'last month', org_id: '' },
    { id: '2', name: 'Active Users', value: 2350, change: 180.1, trend: 'up', period: 'last month', org_id: '' },
    { id: '3', name: 'Sales', value: 12234, change: 19, trend: 'up', period: 'last month', org_id: '' },
    { id: '4', name: 'Active Now', value: 573, change: 201, trend: 'up', period: 'last hour', org_id: '' },
  ] as Metric[];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {displayMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {metric.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                 {metric.name.includes('Revenue') || metric.name.includes('Sales') ? '$' : ''}
                 {isMounted ? metric.value.toLocaleString() : metric.value}
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                {metric.trend === 'up' && <ArrowUp className="text-success h-3 w-3 mr-1" />}
                {metric.trend === 'down' && <ArrowDown className="text-error h-3 w-3 mr-1" />}
                <span className={metric.trend === 'up' ? 'text-success' : metric.trend === 'down' ? 'text-error' : ''}>
                  {metric.change}%
                </span>
                <span className="ml-1">from {metric.period}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[200px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-md border border-dashed border-gray-200">
               Chart Placeholder
             </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
               <div className="flex items-center">
                 <div className="ml-4 space-y-1">
                   <p className="text-sm font-medium leading-none">New user signed up</p>
                   <p className="text-sm text-gray-500">Just now</p>
                 </div>
               </div>
               <div className="flex items-center">
                 <div className="ml-4 space-y-1">
                   <p className="text-sm font-medium leading-none">Project &quot;Alpha&quot; created</p>
                   <p className="text-sm text-gray-500">2 hours ago</p>
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
