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
import { useState, useEffect } from 'react';

export default function AdditionalDetailsStep({ form }: { form: any }) {
  // For skills field bug fix: keep a local string state
  const [skillsInput, setSkillsInput] = useState(
    Array.isArray(form.getValues('skills')) ? form.getValues('skills').join(', ') : form.getValues('skills') || ''
  );

  // Keep local state in sync if form value changes externally
  useEffect(() => {
    const formSkills = form.getValues('skills');
    const asString = Array.isArray(formSkills) ? formSkills.join(', ') : formSkills || '';
    setSkillsInput(asString);
  }, [form.watch('skills')]);

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold mb-4 text-primary">Additional Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col gap-2">
              <FormLabel className="font-semibold">LinkedIn Profile</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://linkedin.com/in/yourprofile" {...field} className="focus:ring-2 focus:ring-primary/40" />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="github"
          render={({ field }) => (
            <FormItem className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col gap-2">
              <FormLabel className="font-semibold">GitHub Profile</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://github.com/yourusername" {...field} className="focus:ring-2 focus:ring-primary/40" />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col gap-2">
            <FormLabel className="font-semibold">Skills</FormLabel>
            <FormControl>
              <Textarea
                placeholder="JavaScript, React, Node.js, Python"
                className="resize-none focus:ring-2 focus:ring-primary/40"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                onBlur={e => {
                  // On blur, update the form value as an array
                  const value = e.target.value;
                  setSkillsInput(value);
                  const skills = value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
                  field.onChange(skills);
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