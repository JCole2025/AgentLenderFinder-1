
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Dashboard() {
  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => fetch('/api/leads').then(res => res.json())
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Lead Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {leads?.map(lead => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td>{new Date(lead.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
