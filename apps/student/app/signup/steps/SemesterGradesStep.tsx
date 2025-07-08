// SemesterGradesStep.tsx
'use client';

import { Controller } from 'react-hook-form';
import { Input } from '@workspace/ui/components/input';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@workspace/ui/components/form';
import { Separator } from '@workspace/ui/components/separator';

export default function SemesterGradesStep({ form }: { form: any }) {
  const sems = Array.from({ length: 8 }, (_, i) => i + 1);

  // Watch all KT values for all semesters
  const ktValues = form.watch('sgpi') || [];

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold mb-4 text-primary">Semester Grades</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sems.map((sem) => (
          <div
            key={sem}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 transition-transform hover:scale-[1.01] flex flex-col gap-4"
          >
            <h4 className="font-semibold text-lg mb-2 text-primary/80">Semester {sem}</h4>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
              <FormField
                control={form.control}
                name={`sgpi.${sem - 1}.sgpi`}
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[120px]">
                    <FormLabel>SGPI *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g., 9.86"
                        value={field.value ?? ''}
                        onChange={e => {
                          const val = e.target.value;
                          field.onChange(val === '' ? '' : Number(val));
                        }}
                        className="focus:ring-2 focus:ring-primary/40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`sgpi.${sem - 1}.kt`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 min-w-[100px]">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!m-0">KT?</FormLabel>
                  </FormItem>
                )}
              />

              {/* Only show KT Dead if KT is checked */}
              {ktValues[sem - 1]?.kt && (
                <FormField
                  control={form.control}
                  name={`sgpi.${sem - 1}.ktDead`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 min-w-[120px]">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!m-0">KT Dead?</FormLabel>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <Separator />
      <p className="text-sm text-muted-foreground mt-2">Note: First 4 semesters are mandatory.</p>
    </div>
  );
}
