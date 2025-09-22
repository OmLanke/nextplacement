'use client';

import { Button } from '@workspace/ui/components/button';
import { Download } from 'lucide-react';

type Applicant = {
  applicationId: number;
  status: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  studentId: number | null;
};

interface ExportButtonProps {
  applicants: Applicant[];
  jobId: number;
  jobTitle: string;
}

export default function ExportButton({ applicants, jobId, jobTitle }: ExportButtonProps) {
  const exportToCSV = () => {
    if (applicants.length === 0) {
      alert('No applications to export.');
      return;
    }

    const headers = ['Application ID', 'Student Name', 'Email', 'Status'];
    const csvData = applicants.map(applicant => [
      applicant.applicationId.toString(),
      `${applicant.firstName ?? ''} ${applicant.lastName ?? ''}`.trim() || 'Unknown',
      applicant.email || '',
      applicant.status
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Clean job title for filename
    const cleanJobTitle = jobTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const filename = `${cleanJobTitle}-job-${jobId}-applications-${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={exportToCSV}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400"
      disabled={applicants.length === 0}
    >
      <Download className="w-4 h-4" />
      Export to CSV
    </Button>
  );
}