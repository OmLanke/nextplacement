'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import {
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Star,
  CheckCircle,
  FileText,
  Upload,
  AlertCircle
} from "lucide-react"
import { applyForJob } from "../app/(main)/actions"
import { type InferSelectModel } from '@workspace/db/drizzle';
import { jobs, companies, resumes } from '@workspace/db/schema';

export type Job = InferSelectModel<typeof jobs> & {
  company: typeof companies.$inferSelect;
};

export type Resume = typeof resumes.$inferSelect;

interface JobApplicationModalProps {
  job: Job & { minCGPA: number };
  studentId: number;
  resumes: Resume[];
  isApplied?: boolean;
}

export default function JobApplicationModal({ job, studentId, resumes, isApplied = false }: JobApplicationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApply = async () => {
    if (!selectedResume) {
      setMessage({ type: 'error', text: 'Please select a resume' });
      return;
    }

    setIsApplying(true);
    setMessage(null);

    try {
      const result = await applyForJob(job.id, studentId, parseInt(selectedResume));

      if (result.success) {
        setMessage({ type: 'success', text: 'Application submitted successfully!' });
        setTimeout(() => {
          setIsOpen(false);
          setMessage(null);
          setSelectedResume('');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to submit application' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while submitting your application' });
    } finally {
      setIsApplying(false);
    }
  };

  const isDeadlinePassed = new Date() > new Date(job.applicationDeadline as any);
  const cannotApplyReason = isApplied
    ? 'You have already applied to this job'
    : resumes.length === 0
      ? 'No resumes found. Please upload a resume first.'
      : isDeadlinePassed
        ? 'Application deadline has passed'
        : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-start">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={Boolean(cannotApplyReason)}
          >
            {isApplied ? 'Applied' : 'Apply Now'}
          </Button>
          {cannotApplyReason && (
            <span className="mt-1 text-xs text-red-600">{cannotApplyReason}</span>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Apply for {job.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Details */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-blue-600 font-medium">{job.company.name}</p>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {job.applicationDeadline.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>Min CGPA: {job.minCGPA}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3">{job.description}</p>
            </CardContent>
          </Card>

          {/* Application Form */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Application Details</h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Resume *
              </label>
              <Select value={selectedResume} onValueChange={setSelectedResume}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((resume) => (
                    <SelectItem key={resume.id} value={resume.id.toString()}>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {resume.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {resumes.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No resumes found. Please upload a resume first.
                </p>
              )}
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {message.type === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {message.text}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleApply}
                disabled={isApplying || resumes.length === 0 || isApplied}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isApplying ? 'Submitting...' : 'Submit Application'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isApplying}
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Important Notes:</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Make sure your resume is up-to-date and relevant to this position</li>
              <li>• You can only apply once per job posting</li>
              <li>• Applications will be reviewed by the company within 1-2 weeks</li>
              <li>• You'll receive email notifications about your application status</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
