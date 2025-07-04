"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Button } from "@workspace/ui/components/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { jobSchema, type JobFormData } from "./schema"
import { createJob, createCompany } from "./actions"
import { Popover, PopoverTrigger, PopoverContent } from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { format } from "date-fns"
import {
  CalendarIcon,
  Plus,
  Building2,
  Briefcase,
  MapPin,
  DollarSign,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  LinkIcon,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"

function NewJobForm({ companies }: { companies: { id: number; name: string }[] }) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)
  const [addingCompany, setAddingCompany] = useState(false)
  const [companyList, setCompanyList] = useState(companies)
  const [newCompanyName, setNewCompanyName] = useState("")
  const [newCompanyEmail, setNewCompanyEmail] = useState("")
  const [newCompanyLink, setNewCompanyLink] = useState("")
  const [newCompanyDescription, setNewCompanyDescription] = useState("")
  const [newCompanyImageURL, setNewCompanyImageURL] = useState("")
  const [companyError, setCompanyError] = useState<string | null>(null)

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      companyId: companies[0]?.id ?? 0,
      title: "",
      link: "",
      description: "",
      location: "",
      imageURL: "",
      salary: "",
      applicationDeadline: new Date(),
      minCGPA: 0,
      minSSC: 0,
      minHSC: 0,
      allowDeadKT: true,
      allowLiveKT: true,
    },
  })

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await createJob(formData)
      if (result?.success) {
        setSuccess(true)
        form.reset(form.formState.defaultValues)
      } else {
        setError(result?.error || "Failed to create job")
      }
    })
  }

  async function handleAddCompany(e: React.FormEvent) {
    e.preventDefault()
    setCompanyError(null)

    if (!newCompanyName.trim() || !newCompanyEmail.trim() || !newCompanyLink.trim() || !newCompanyDescription.trim()) {
      setCompanyError("Please fill in all required fields")
      return
    }

    setAddingCompany(true)
    const formData = new FormData()
    formData.append("name", newCompanyName.trim())
    formData.append("email", newCompanyEmail.trim())
    formData.append("link", newCompanyLink.trim())
    formData.append("description", newCompanyDescription.trim())
    formData.append("imageURL", newCompanyImageURL.trim())

    const result = await createCompany(formData)
    if (result?.success && result.company) {
      setCompanyList((prev) => [...prev, result.company])
      form.setValue("companyId", result.company.id)
      setNewCompanyName("")
      setNewCompanyEmail("")
      setNewCompanyLink("")
      setNewCompanyDescription("")
      setNewCompanyImageURL("")
      setShowModal(false)
    } else {
      setCompanyError(result?.error || "Failed to add company")
    }
    setAddingCompany(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Job Listing</h1>
          <p className="text-gray-600">Fill in the details below to post a new job opportunity</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <Form {...form}>
              <form action={handleSubmit} className="space-y-8">
                {/* Success/Error Messages */}
                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Job created successfully! You can create another one or go back to the dashboard.
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Company Selection Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
                  </div>

                  <FormField
                    control={form.control}
                    name="companyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Select Company *</FormLabel>
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={String(field.value || "")}
                          >
                            <FormControl>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Choose a company" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companyList.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Dialog open={showModal} onOpenChange={setShowModal}>
                            <DialogTrigger asChild>
                              <Button type="button" variant="outline" size="icon" className="shrink-0 bg-transparent">
                                <Plus className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Building2 className="w-5 h-5" />
                                  Add New Company
                                </DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleAddCompany} className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">Company Name *</label>
                                  <Input
                                    value={newCompanyName}
                                    onChange={(e) => setNewCompanyName(e.target.value)}
                                    placeholder="Enter company name"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">Contact Email *</label>
                                  <Input
                                    value={newCompanyEmail}
                                    onChange={(e) => setNewCompanyEmail(e.target.value)}
                                    placeholder="contact@company.com"
                                    type="email"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">Website *</label>
                                  <Input
                                    value={newCompanyLink}
                                    onChange={(e) => setNewCompanyLink(e.target.value)}
                                    placeholder="https://company.com"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">Company Logo URL</label>
                                  <Input
                                    value={newCompanyImageURL}
                                    onChange={(e) => setNewCompanyImageURL(e.target.value)}
                                    placeholder="https://example.com/logo.png"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">Description *</label>
                                  <Textarea
                                    value={newCompanyDescription}
                                    onChange={(e) => setNewCompanyDescription(e.target.value)}
                                    placeholder="Brief description of the company..."
                                    className="min-h-[80px] resize-none"
                                    required
                                  />
                                </div>
                                {companyError && (
                                  <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">{companyError}</AlertDescription>
                                  </Alert>
                                )}
                                <Button type="submit" disabled={addingCompany} className="w-full">
                                  {addingCompany ? "Adding Company..." : "Add Company"}
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Job Details Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Job Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Software Engineer" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            Location *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Mumbai, India" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            Salary *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. ₹5-8 LPA" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="applicationDeadline"
                      render={({ field }) => {
                        const getDisplayDate = (value: string) => {
                          if (!value) return ""
                          try {
                            return format(new Date(value), "PPP")
                          } catch {
                            return value
                          }
                        }

                        const selectedDate = field.value ? new Date(field.value) : undefined

                        const handleSelect = (date: Date | undefined) => {
                          setTimeout(() => {
                            if (date) {
                              field.onChange(date.toISOString().slice(0, 10))
                            } else {
                              field.onChange("")
                            }
                          }, 0)
                        }

                        return (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-sm font-medium text-gray-700">Application Deadline *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "h-11 pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                    type="button"
                                  >
                                    {getDisplayDate(typeof field.value === "string" ? field.value : "") || (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={handleSelect}
                                  captionLayout="dropdown"
                                  key={typeof field.value === "string" ? field.value : "empty"}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            <LinkIcon className="w-4 h-4" />
                            Job Application Link *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://company.com/careers/job-id" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imageURL"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Job Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/job-image.png" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Job Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the role, responsibilities, and requirements..."
                            {...field}
                            className="min-h-[120px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Academic Requirements Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Academic Requirements</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="minCGPA"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Minimum CGPA</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minSSC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Minimum SSC %</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minHSC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Minimum HSC %</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="allowDeadKT"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-50">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">Allow Dead KT</FormLabel>
                            <p className="text-xs text-gray-600">Students with cleared backlogs can apply</p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowLiveKT"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-50">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">Allow Live KT</FormLabel>
                            <p className="text-xs text-gray-600">Students with pending backlogs can apply</p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Job...
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-4 h-4 mr-2" />
                        Create Job Listing
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NewJobForm
