// AcademicDetailsStep.tsx
'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@workspace/ui/components/form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@workspace/ui/components/select';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';

export default function AcademicDetailsStep({ form }: { form: any }) {
  const degreeOptions = [
    { value: 'btech', label: 'B.Tech' },
    { value: 'be', label: 'B.E.' },
    { value: 'bsc', label: 'B.Sc' },
    { value: 'bca', label: 'BCA' },
  ];

  const yearOptions = [
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' },
  ];

  const branchOptions = [
    { value: 'cse', label: 'Computer Engineering' },
    { value: 'it', label: 'Information Technology' },
    { value: 'ece', label: 'Electronics & Communication' },
    { value: 'mechanical', label: 'Mechanical' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Academic Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="degree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your degree" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {degreeOptions.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Year of graduation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {yearOptions.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {branchOptions.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="ssc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SSC % *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="10th percentage"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hsc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{form.watch('isDiploma') ? 'Diploma % *' : 'HSC % *'}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={form.watch('isDiploma') ? 'Diploma percentage' : '12th percentage'}
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDiploma"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormLabel className="!m-0">Diploma Holder?</FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
