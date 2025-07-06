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

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Student Registration Form
            </CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Step {currentStep} of {steps.length}
                </span>
                <span>{steps[currentStep - 1]?.title}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
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
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  {currentStep === steps.length ? (
                    <Button type="submit" disabled={isSubmitting || isPending}>
                      {isSubmitting || isPending ? 'Submitting...' : 'Submit'}
                    </Button>
                  ) : (
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
