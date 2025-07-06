// ResumeStep.tsx
'use client';

import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@workspace/ui/components/form';
import { useForm } from 'react-hook-form';

export default function ResumeStep({ form }: { form: any }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { getValues, setValue } = form;
  const resumes = getValues('resume') || [];

  const modalForm = useForm({
    defaultValues: {
      title: '',
      link: '',
    },
  });

  const addResume = () => {
    const data = modalForm.getValues();
    const updated = [...resumes, data];
    setValue('resume', updated);
    modalForm.reset();
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resumes</h3>
        <Button variant="outline" onClick={() => setModalOpen(true)}>
          Add Resume
        </Button>
      </div>

      {/* Custom Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Add Resume</h2>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={modalForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Summer 2025 Resume" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={modalForm.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input type="url" {...field} placeholder="https://drive.google.com/..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addResume}>Add</Button>
            </div>
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        {resumes.length === 0 && (
          <p className="text-sm text-muted-foreground">No resumes uploaded yet.</p>
        )}

        {resumes.map((resume: any, idx: number) => (
          <Card key={idx} className="bg-muted">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{resume.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <a href={resume.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {resume.link}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}