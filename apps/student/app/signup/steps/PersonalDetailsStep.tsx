// PersonalDetailsStep.tsx
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
import { Separator } from '@workspace/ui/components/separator';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@workspace/ui/components/select';
import { Calendar } from '@workspace/ui/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';
import { Button } from '@workspace/ui/components/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@workspace/ui/lib/utils';

export default function PersonalDetailsStep({ form }: { form: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter your first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter your last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your middle name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="personalGmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your Gmail address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rollNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roll Number *</FormLabel>
              <FormControl>
                <Input placeholder="Enter your roll number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number *</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="Enter your phone number" {...field} />
            </FormControl>
            <FormDescription>Without country code</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-lg font-semibold">
          Parents Details (Enter atleast one parent's details)
        </h3>
      </div>

      {/* Parent contacts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="mothersName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother's Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your mother's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mothersEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother's Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="mother@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mothersPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother's Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="10-digit number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="hidden md:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="fathersName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father's Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your father's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fathersEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father's Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="father@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fathersPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father's Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="10-digit number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address *</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter your address" className="resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
