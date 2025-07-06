// InternshipStep.tsx
'use client';

import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Separator } from '@workspace/ui/components/separator';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@workspace/ui/components/form';
import { useForm } from 'react-hook-form';

export default function InternshipStep({ form }: { form: any }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { getValues, setValue } = form;
  const internships = getValues('internships') || [];

  const modalForm = useForm({
    defaultValues: {
      title: '',
      company: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
    },
  });

  const addInternship = () => {
    const data = modalForm.getValues();
    const updated = [...internships, data];
    setValue('internships', updated);
    modalForm.reset();
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Internships</h3>
        <Button variant="outline" onClick={() => setModalOpen(true)}>
          Add Internship
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
            <h2 className="text-xl font-bold mb-4">Add Internship Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={modalForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. SDE Intern" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={modalForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Google" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={modalForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Describe your work..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={modalForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Remote / Mumbai" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={modalForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={modalForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addInternship}>Add</Button>
            </div>
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        {internships.length === 0 && (
          <p className="text-sm text-muted-foreground">No internships added yet.</p>
        )}

        {internships.map((intern: any, idx: number) => (
          <Card key={idx} className="bg-muted">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                {intern.title} at {intern.company}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>{intern.location}</p>
              <p>
                {intern.startDate} to {intern.endDate}
              </p>
              <p>{intern.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
