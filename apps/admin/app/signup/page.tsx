"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Progress } from "@workspace/ui/components/progress"
import { Separator } from "@workspace/ui/components/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@workspace/ui/components/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

// Form schema
const formSchema = z.object({
  // Personal Details
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  fathersName: z.string().optional(),
  mothersName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  rollNumber: z.string().min(1, "Roll number is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),

  // Academic Details
  degree: z.string().min(1, "Degree is required"),
  year: z.string().min(1, "Year is required"),
  branch: z.string().min(1, "Branch is required"),
  ssc: z.string().min(1, "SSC percentage is required"),
  hsc: z.string().min(1, "HSC percentage is required"),

  // Semester Grades
  sem1: z.string().min(1, "Semester 1 grade is required"),
  sem1KT: z.string().min(1, "Semester 1 KT status is required"),
  sem2: z.string().min(1, "Semester 2 grade is required"),
  sem2KT: z.string().min(1, "Semester 2 KT status is required"),

  // Additional Details
  linkedin: z.string().url("Invalid LinkedIn URL"),
  github: z.string().url("Invalid GitHub URL"),
  skills: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const steps = [
  {
    id: 1,
    title: "Personal Details",
    fields: ["firstName", "lastName", "fathersName", "mothersName", "email", "rollNumber", "phoneNumber", "address"],
  },
  { id: 2, title: "Academic Details", fields: ["degree", "year", "branch", "ssc", "hsc"] },
  { id: 3, title: "Semester Grades", fields: ["sem1", "sem1KT", "sem2", "sem2KT"] },
  { id: 4, title: "Additional Details", fields: ["linkedin", "github", "skills"] },
]

export default function StudentRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      fathersName: "",
      mothersName: "",
      email: "",
      rollNumber: "",
      phoneNumber: "",
      address: "",
      degree: "",
      year: "",
      branch: "",
      ssc: "",
      hsc: "",
      sem1: "",
      sem1KT: "",
      sem2: "",
      sem2KT: "",
      linkedin: "",
      github: "",
      skills: "",
    },
  })

  const validateCurrentStep = async () => {
    const currentStepData = steps.find((step) => step.id === currentStep)
    if (!currentStepData) return false

    const result = await form.trigger(currentStepData.fields as any)
    return result
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Form submitted:", data)
      alert("Form submitted successfully!")
    } catch (error) {
      console.error("Submission error:", error)
      alert("Submission failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetailsStep form={form} />
      case 2:
        return <AcademicDetailsStep form={form} />
      case 3:
        return <SemesterGradesStep form={form} />
      case 4:
        return <AdditionalDetailsStep form={form} />
      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Student Registration Form</CardTitle>
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStep()}

                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                    Previous
                  </Button>

                  {currentStep === steps.length ? (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit"}
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
  )
}

function PersonalDetailsStep({ form }: { form: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
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
  )
}

function AcademicDetailsStep({ form }: { form: any }) {
  const degreeOptions = [
    { value: "btech", label: "B.Tech" },
    { value: "be", label: "B.E." },
    { value: "bsc", label: "B.Sc" },
    { value: "bca", label: "BCA" },
  ]

  const yearOptions = [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
  ]

  const branchOptions = [
    { value: "cse", label: "Computer Science" },
    { value: "it", label: "Information Technology" },
    { value: "ece", label: "Electronics & Communication" },
    { value: "mechanical", label: "Mechanical" },
  ]

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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="ssc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SSC Percentage *</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter your SSC percentage" {...field} />
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
              <FormLabel>HSC Percentage *</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter your HSC percentage" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

function SemesterGradesStep({ form }: { form: any }) {
  const ktOptions = [
    { value: "0", label: "0 KT" },
    { value: "1", label: "1 KT" },
    { value: "2", label: "2 KT" },
    { value: "3+", label: "3+ KT" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Semester Grades</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sem1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester 1 Grade *</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="9.86" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sem1KT"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester 1 KT *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select KT status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ktOptions.map(({ label, value }) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sem2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester 2 Grade *</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="9.86" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sem2KT"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester 2 KT *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select KT status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ktOptions.map(({ label, value }) => (
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
    </div>
  )
}

function AdditionalDetailsStep({ form }: { form: any }) {
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
                placeholder="Enter your skills (e.g., JavaScript, React, Node.js, Python)"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>Use commas to separate skills</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
