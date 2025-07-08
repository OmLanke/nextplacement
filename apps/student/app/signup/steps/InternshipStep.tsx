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
import { Briefcase, MapPin, CalendarDays, X } from 'lucide-react';

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
    <div className="space-y-10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-primary">Internships</h3>
        <Button
          variant="default"
          className="rounded-full px-6 py-2 text-base font-semibold shadow-md hover:scale-105 transition-transform"
          onClick={() => setModalOpen(true)}
        >
          + Add Internship
        </Button>
      </div>

      {/* Custom Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 relative border border-gray-200 pointer-events-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-primary rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
              type="button"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">Add Internship Details</h2>
            <div className="grid grid-cols-1 gap-5">
              <FormField
                control={modalForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. SDE Intern" className="focus:ring-2 focus:ring-primary/40" />
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
                      <Input {...field} placeholder="e.g. Google" className="focus:ring-2 focus:ring-primary/40" />
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
                      <Textarea {...field} placeholder="Describe your work..." className="focus:ring-2 focus:ring-primary/40" />
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
                      <Input {...field} placeholder="Remote / Mumbai" className="focus:ring-2 focus:ring-primary/40" />
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
                        <Input type="date" {...field} className="focus:ring-2 focus:ring-primary/40" />
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
                        <Input type="date" {...field} className="focus:ring-2 focus:ring-primary/40" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end mt-8 gap-3">
              <Button variant="outline" onClick={() => setModalOpen(false)} className="rounded-full px-5">
                Cancel
              </Button>
              <Button onClick={addInternship} className="rounded-full px-5">
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      <Separator />

      <div className="bg-white/80 border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6 min-h-[120px]">
        {internships.length === 0 && (
          <p className="text-base text-muted-foreground text-center">No internships added yet.</p>
        )}

        {internships.map((intern: any, idx: number) => (
          <Card key={idx} className="bg-white border border-gray-100 rounded-xl shadow flex flex-col md:flex-row items-start md:items-center gap-4 p-4">
            <div className="flex flex-col flex-1 gap-1">
              <CardHeader className="p-0 mb-1">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase size={18} className="text-primary" />
                  {intern.title} <span className="text-gray-500 font-normal">@ {intern.company}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-1 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{intern.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarDays size={16} />
                  <span>{intern.startDate} to {intern.endDate}</span>
                </div>
                <div className="text-gray-700 mt-1">{intern.description}</div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
