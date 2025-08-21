// Due to the length and complexity of the complete updated form, the full implementation is provided modularly.
// This file only includes the top-level form layout and updated schema logic. Other components (InternshipModal, ResumeModal, etc.) 
// should be created as separate files or extracted for cleanliness.

'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// Only import used UI components
import { Button } from '@workspace/ui/components/button';
import { Progress } from '@workspace/ui/components/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Form } from '@workspace/ui/components/form';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { studentSignupSchema, StudentSignup } from './schema';
import PersonalDetailsStep from './steps/PersonalDetailsStep';
import AcademicDetailsStep from './steps/AcademicDetailsStep';
import SemesterGradesStep from './steps/SemesterGradesStep';
import AdditionalDetailsStep from './steps/AdditionalDetailsStep';
import InternshipStep from './steps/InternshipStep';
import ResumeStep from './steps/ResumeStep';

import { signupAction } from './action';

const steps = [
  {
    id: 1,
    title: 'Personal Details',
    fields: [
      'firstName',
      'lastName',
      'mothersName',
      'rollNumber',
      'phoneNumber',
      'address',
      'gender',
      'dob',
      'personalGmail',
    ],
  },
  {
    id: 2,
    title: 'Academic Details',
    fields: ['degree', 'year', 'branch', 'ssc', 'hsc', 'isDiploma'],
  },
  { id: 3, title: 'Semester Grades', fields: ['sgpi'] },
  { id: 4, title: 'Additional Details', fields: ['linkedin', 'github', 'skills'] },
  { id: 5, title: 'Internships', fields: ['internships'] },
  { id: 6, title: 'Resumes', fields: ['resume'] },
];

export default function StudentRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<any>(null);

  const form = useForm<StudentSignup>({
    resolver: zodResolver(studentSignupSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      mothersName: '',
      rollNumber: '',
      phoneNumber: '',
      address: '',
      gender: '',
      dob: new Date(),
      personalGmail: '',
      degree: '',
      branch: '',
      year: '',
      skills: [],
      linkedin: '',
      github: '',
      ssc: 0,
      hsc: 0,
      isDiploma: false,
      sgpi: Array.from({ length: 8 }, (_, i) => ({
        sem: i + 1,
        sgpi: 0,
        kt: false,
        ktDead: false,
      })),
      internships: [],
      resume: [],
    },
  });

  // console.log(form.formState.errors)

  const validateCurrentStep = async () => {
    const current = steps.find((s) => s.id === currentStep);
    if (!current) return false;

    try {
      const result = await form.trigger(current.fields as (keyof StudentSignup)[]);
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else if (!isValid) {
      alert('Please fill all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: StudentSignup) => {
    // Only submit if on the last step
    if (currentStep !== steps.length) return;

    setIsSubmitting(true);
    try {
      const result = await signupAction(data);
      if (result && result.success) {
        router.push('/');
        return;
      }
      if (result && result.error) {
        const errorMessage = Array.isArray(result.error)
          ? result.error.map((e) => e.message || e).join(', ')
          : result.error;
        alert('Submission failed: ' + errorMessage);
      } else {
        alert('Submission failed. Try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Submission failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetailsStep form={form} />;
      case 2:
        return <AcademicDetailsStep form={form} />;
      case 3:
        return <SemesterGradesStep form={form} />;
      case 4:
        return <AdditionalDetailsStep form={form} />;
      case 5:
        return <InternshipStep form={form} />;
      case 6:
        return <ResumeStep form={form} />;
      default:
        return null;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  // Map field keys to user-friendly names
  const fieldLabels: Record<string, string> = {
    firstName: 'First Name',
    middleName: 'Middle Name',
    lastName: 'Last Name',
    mothersName: "Mother's Name",
    rollNumber: 'Roll Number',
    phoneNumber: 'Phone Number',
    address: 'Address',
    gender: 'Gender',
    dob: 'Date of Birth',
    personalGmail: 'Personal Email',
    degree: 'Degree',
    branch: 'Branch',
    year: 'Year',
    skills: 'Skills',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    ssc: 'SSC %',
    hsc: 'HSC %',
    isDiploma: 'Diploma Holder',
    sgpi: 'Semester Grades',
    internships: 'Internships',
    resume: 'Resumes',
  };

  // Helper to recursively extract error fields
  function extractErrorFields(errors: any, prefix = ''): string[] {
    let fields: string[] = [];
    for (const key in errors) {
      if (typeof errors[key] === 'object' && errors[key] !== null && 'message' in errors[key]) {
        fields.push(prefix + key);
      } else if (typeof errors[key] === 'object' && errors[key] !== null) {
        fields = fields.concat(extractErrorFields(errors[key], prefix + key + '.'));
      }
    }
    return fields;
  }

  return (
    <div className="relative min-h-screen py-8 flex flex-col items-center justify-start overflow-hidden animate-fade-in live-bg-gradient">
      {/* Animated floating blobs with more vibrant colors */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-[#f8f8f8] rounded-full blur-3xl opacity-60 z-0 animate-blob1" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[32rem] h-[32rem] bg-[#d9d9d9] rounded-full blur-3xl opacity-60 z-0 animate-blob2" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#b3b3b3] rounded-full blur-2xl opacity-40 z-0 -translate-x-1/2 -translate-y-1/2 animate-blob3" />
      <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-[#7a7a7a] rounded-full blur-2xl opacity-50 z-0 animate-blob4" />
      <div className="absolute bottom-[15%] left-[15%] w-64 h-64 bg-[#262626] rounded-full blur-2xl opacity-40 z-0 animate-blob5" />

      {/* Welcoming heading - now always at the top */}
      <div className="w-full text-center mb-8 z-10">
        <h1 className="text-4xl font-extrabold text-primary drop-shadow-sm tracking-tight mb-2">Welcome to Placement Portal</h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">Register below to get started with your placement journey. Fill in your details step by step and let your career take off!</p>
      </div>
      <div className="max-w-4xl w-full mx-auto px-4 z-10">
        <Card className="shadow-2xl rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-center text-primary drop-shadow-sm tracking-tight">
              Student Registration Form
            </CardTitle>
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Step {currentStep} of {steps.length}
                </span>
                <span className="font-semibold text-primary/80">{steps[currentStep - 1]?.title}</span>
              </div>
              <Progress value={progress} className="w-full h-2 rounded-full bg-muted" />
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                ref={formRef}
                onSubmit={currentStep === steps.length
                  ? form.handleSubmit(onSubmit, () => {
                      // Get all error fields
                      const errorFields = extractErrorFields(form.formState.errors);
                      // Map to user-friendly names
                      const prettyFields = errorFields.map((key) => {
                        // Try to map top-level, or fallback to key
                        const topKey = String(key.split('.')[0]);
                        return fieldLabels[topKey] || key;
                      });
                      alert(
                        'Please fill all required fields before submitting.\n' +
                        (prettyFields.length > 0
                          ? 'Missing/invalid: ' + prettyFields.join(', ')
                          : '')
                      );
                    })
                  : (e) => e.preventDefault()
                }
                className="space-y-8"
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    e.target instanceof HTMLElement &&
                    e.target.tagName !== 'TEXTAREA'
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                {renderStep()}
                <div className="flex justify-between pt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="rounded-full px-8 py-2 shadow-sm"
                  >
                    Previous
                  </Button>
                  {currentStep === steps.length ? (
                    <Button type="submit" disabled={isSubmitting || isPending} className="rounded-full px-8 py-2 shadow-md bg-gradient-to-r from-primary to-accent text-white">
                      {isSubmitting || isPending ? 'Submitting...' : 'Submit'}
                    </Button>
                  ) : (
                    <Button type="button" onClick={nextStep} className="rounded-full px-8 py-2 shadow-md bg-gradient-to-r from-primary to-accent text-white">
                      Next
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      {/* Animated gradient and blob styles */}
      <style jsx global>{`
  /* ====== BACKGROUND GRADIENT ==================================== */
  .live-bg-gradient {
    /* lightest → darkest slate-blue progression */
    background: linear-gradient(
      120deg,
      #f1f5f9,     /* slate-50  */
      #cbd5e1 30%, /* slate-200 */
      #94a3b8 60%, /* slate-400 */
      #64748b 80%, /* slate-500 */
      #334155      /* slate-700 */
    );
    background-size: 300% 300%;
    animation: gradientMove 16s ease-in-out infinite;
  }

  @keyframes gradientMove {
    0%   { background-position: 0% 50%; }
    25%  { background-position: 100% 50%; }
    50%  { background-position: 100% 100%; }
    75%  { background-position: 0% 100%; }
    100% { background-position: 0% 50%; }
  }

  /* ====== BLOB COLORS ============================================ */
  .animate-blob1 { background: #e2e8f0; } /* slate-100 */
  .animate-blob2 { background: #cbd5e1; } /* slate-200 */
  .animate-blob3 { background: #94a3b8; } /* slate-400 */
  .animate-blob4 { background: #64748b; } /* slate-500 */
  .animate-blob5 { background: #475569; } /* slate-600 */

  /* ====== BLOB MOTION (unchanged) ================================ */
  .animate-blob1 { animation: blobMove1 18s ease-in-out infinite; }
  .animate-blob2 { animation: blobMove2 22s ease-in-out infinite; }
  .animate-blob3 { animation: blobMove3 20s ease-in-out infinite; }
  .animate-blob4 { animation: blobMove4 26s ease-in-out infinite; }
  .animate-blob5 { animation: blobMove5 24s ease-in-out infinite; }

  /* existing keyframes … */
`}</style>

    </div>
  );
}
