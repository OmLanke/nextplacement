'use client';

import { useMemo, useState, useTransition } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@workspace/ui/components/table';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@workspace/ui/components/select';
import StatusSelect from './StatusSelect';

type Applicant = {
  applicationId: number;
  status: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  studentId: number | null;
};

const STATUS_OPTIONS = [
  'in review',
  'Online Assessment',
  'Interview round',
  'offer given',
  'accepted',
  'rejected',
];

export default function ApplicationsTable({ applicants }: { applicants: Applicant[] }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState<string>('');
  const [rows, setRows] = useState<Applicant[]>(applicants);
  const [sendEmail, setSendEmail] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((a) => {
      const name = `${a.firstName ?? ''} ${a.lastName ?? ''}`.toLowerCase();
      const email = (a.email ?? '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [rows, query]);

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? filtered.map((a) => a.applicationId) : []);
  };

  const toggleOne = (id: number, checked: boolean) => {
    setSelected((prev) => (checked ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)));
  };

  const onBulkUpdate = () => {
    if (!bulkStatus || selected.length === 0) return;
    const targets = new Set(selected);
    startTransition(async () => {
      const updates = rows.filter((r) => targets.has(r.applicationId));
      let notifiedCount = 0;
      let errorCount = 0;
      for (const r of updates) {
        try {
          const res = await fetch(`/api/applications/${r.applicationId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: bulkStatus, studentId: r.studentId ?? 0, notify: sendEmail }),
          });
          const data = await res.json();
          if (!res.ok) {
            errorCount += 1;
          } else if (sendEmail) {
            if (data?.notified) notifiedCount += 1;
            if (data?.emailError) errorCount += 1;
          }
        } catch (_e) {
          errorCount += 1;
        }
      }
      setRows((prev) =>
        prev.map((r) => (targets.has(r.applicationId) ? { ...r, status: bulkStatus } : r)),
      );
      setSelected([]);

      if (sendEmail) {
        if (errorCount === 0) {
          alert(`Updated ${updates.length} and emailed ${notifiedCount} student(s).`);
        } else {
          alert(`Updated ${updates.length}. Emails sent: ${notifiedCount}. Errors: ${errorCount}.`);
        }
      } else {
        alert(`Updated ${updates.length}.`);
      }
    });
  };

  const allSelected = filtered.length > 0 && selected.length === filtered.length;
  const someSelected = selected.length > 0 && selected.length < filtered.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72"
          />
          <span className="text-sm text-gray-500">{filtered.length} results</span>
        </div>
        <div className="flex items-center gap-2">
          <Select value={bulkStatus} onValueChange={setBulkStatus}>
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Bulk update status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
            />
            Send email notifications
          </label>
          <Button onClick={onBulkUpdate} disabled={!bulkStatus || selected.length === 0 || isPending}>
            Update {selected.length || ''}
          </Button>
          {selected.length > 0 && (
            <Button variant="outline" onClick={() => setSelected([])} disabled={isPending}>
              Clear Selection
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
              </TableHead>
              <TableHead className="font-medium text-gray-700">Name</TableHead>
              <TableHead className="font-medium text-gray-700">Email</TableHead>
              <TableHead className="font-medium text-gray-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((applicant) => (
              <TableRow key={applicant.applicationId} className="hover:bg-gray-50">
                <TableCell>
                  <input
                    type="checkbox"
                    aria-label={`Select ${applicant.email ?? ''}`}
                    checked={selected.includes(applicant.applicationId)}
                    onChange={(e) => toggleOne(applicant.applicationId, e.target.checked)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {`${applicant.firstName ?? ''} ${applicant.lastName ?? ''}`.trim() || 'Unknown'}
                </TableCell>
                <TableCell className="text-gray-600">{applicant.email}</TableCell>
                <TableCell>
                  <StatusSelect
                    applicationId={applicant.applicationId}
                    initialStatus={applicant.status}
                    studentId={applicant.studentId ?? 0}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


