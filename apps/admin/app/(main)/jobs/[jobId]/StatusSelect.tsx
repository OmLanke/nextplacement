'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@workspace/ui/components/select';

const STATUS_OPTIONS = [
  'in review',
  'Online Assessment',
  'Interview round',
  'offer given',
  'accepted',
  'rejected',
];

interface StatusSelectProps {
  applicationId: number;
  initialStatus: string;
  studentId: number;
}

export default function StatusSelect({
  applicationId,
  initialStatus,
  studentId,
}: StatusSelectProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  // Sync local state when parent updates the initialStatus (e.g., after bulk update)
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const handleChange = (value: string) => {
    setStatus(value); // Optimistic update
    startTransition(async () => {
      await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value, studentId }),
      });
    });
  };

  return (
    <Select value={status} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="min-w-[160px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
