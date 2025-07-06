// SemesterGradesStep.tsx
'use client';

import { Controller } from 'react-hook-form';
import { Input } from '@workspace/ui/components/input';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@workspace/ui/components/form';
import { Separator } from '@workspace/ui/components/separator';

export default function SemesterGradesStep({ form }: { form: any }) {
  const sems = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Semester Grades</h3>

      {sems.map((sem) => (
        <div key={sem} className="border p-4 rounded-md shadow-sm">
          <h4 className="font-medium text-md mb-2">Semester {sem}</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`sgpi.${sem - 1}.sgpi`}
              render={({ field }) => (
                <FormItem>
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
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!m-0">KT?</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`sgpi.${sem - 1}.ktDead`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!m-0">KT Dead?</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}

      <Separator />
      <p className="text-sm text-muted-foreground">Note: First 4 semesters are mandatory.</p>
    </div>
  );
}
