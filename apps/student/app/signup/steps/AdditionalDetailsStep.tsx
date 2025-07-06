// AdditionalDetailsStep.tsx
'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';

export default function AdditionalDetailsStep({ form }: { form: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Additional Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile *</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://linkedin.com/in/yourprofile" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="github"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub Profile *</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://github.com/yourusername" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills</FormLabel>
            <FormControl>
              <Textarea
                placeholder="JavaScript, React, Node.js, Python"
                className="resize-none"
                value={field.value ? (Array.isArray(field.value) ? field.value.join(", ") : field.value) : ""}
                onChange={e => {
                  const value = e.target.value;
                  field.onChange(value.split(',').map(s => s.trim()).filter(Boolean));
                }}
              />
            </FormControl>
            <FormDescription>Use commas to separate skills</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}