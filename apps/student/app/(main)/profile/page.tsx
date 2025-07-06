'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  BookOpen,
  Award,
  Edit,
  Save,
  Camera,
  Linkedin,
  Github,
  FileText,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react"
import { getStudentProfile, updateStudentProfile } from "../actions"

// Mock student data as fallback
const mockStudent = {
  id: 1,
  firstName: "John",
  middleName: "Michael",
  lastName: "Doe",
  email: "john.doe@college.edu",
  rollNumber: "2021CS001",
  phoneNumber: "+91 98765 43210",
  address: "123 College Street, Mumbai, Maharashtra",
  gender: "Male",
  dob: "2000-05-15",
  degree: "Bachelor of Technology",
  branch: "Computer Science",
  year: "4th Year",
  skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git"],
  linkedin: "https://linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  ssc: 9.2,
  hsc: 8.8,
  isDiploma: false,
  verified: true,
  markedOut: false,
  profilePicture: null,
  resumes: [
    { id: 1, title: "Resume_v2.pdf", link: "/resumes/resume_v2.pdf" }
  ]
}

export default function ProfilePage() {
  const [student, setStudent] = useState(mockStudent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadStudentProfile();
  }, []);

  const loadStudentProfile = async () => {
    try {
      const result = await getStudentProfile(1); // Using student ID 1 for demo
      if (result.success && result.student) {
        setStudent(result.student as any);
      } else {
        setError(result.error || 'Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (section: string) => {
    setEditingSection(section);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditData({});
  };

  const handleSave = async (section: string) => {
    setIsSaving(true);
    try {
      const result = await updateStudentProfile(student.id, editData);
      if (result.success) {
        setStudent(prev => ({ ...prev, ...editData }));
        setEditingSection(null);
        setEditData({});
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-xl text-gray-600">Manage your personal information and academic details</p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                      {student.firstName?.[0] || 'S'}{student.lastName?.[0] || 'T'}
                    </div>
                    <Button size="sm" className="absolute bottom-2 right-2 w-8 h-8 rounded-full p-0">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {student.firstName} {student.middleName} {student.lastName}
                  </h2>
                  <p className="text-gray-600 mb-4">{student.email}</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge className={student.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                      {student.verified ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pending Verification
                        </>
                      )}
                    </Badge>
                    {student.markedOut && (
                      <Badge className="bg-red-100 text-red-700">
                        Marked Out
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Roll Number: {student.rollNumber}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Academic Year</span>
                    <span className="font-medium">{student.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Branch</span>
                    <span className="font-medium">{student.branch}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SSC Score</span>
                    <span className="font-medium">{student.ssc}/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">HSC Score</span>
                    <span className="font-medium">{student.hsc}/10</span>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Social Links */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Social Links</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn Profile
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  {editingSection !== 'personal' ? (
                    <Button size="sm" variant="outline" onClick={() => handleEdit('personal')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave('personal')} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    {editingSection === 'personal' ? (
                      <Input 
                        id="firstName" 
                        value={editData.firstName || student.firstName || ''} 
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    ) : (
                      <Input id="firstName" value={student.firstName || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="middleName">Middle Name</Label>
                    {editingSection === 'personal' ? (
                      <Input 
                        id="middleName" 
                        value={editData.middleName || student.middleName || ''} 
                        onChange={(e) => handleInputChange('middleName', e.target.value)}
                      />
                    ) : (
                      <Input id="middleName" value={student.middleName || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    {editingSection === 'personal' ? (
                      <Input 
                        id="lastName" 
                        value={editData.lastName || student.lastName || ''} 
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    ) : (
                      <Input id="lastName" value={student.lastName || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={student.email || ''} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {editingSection === 'personal' ? (
                      <Input 
                        id="phone" 
                        value={editData.phoneNumber || student.phoneNumber || ''} 
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      />
                    ) : (
                      <Input id="phone" value={student.phoneNumber || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    {editingSection === 'personal' ? (
                      <Input 
                        id="gender" 
                        value={editData.gender || student.gender || ''} 
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                      />
                    ) : (
                      <Input id="gender" value={student.gender || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    {editingSection === 'personal' ? (
                      <Input 
                        id="dob" 
                        value={editData.dob || student.dob || ''} 
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                      />
                    ) : (
                      <Input id="dob" value={student.dob || ''} readOnly />
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    {editingSection === 'personal' ? (
                      <Textarea 
                        id="address" 
                        value={editData.address || student.address || ''} 
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    ) : (
                      <Textarea id="address" value={student.address || ''} readOnly />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Academic Information
                  </CardTitle>
                  {editingSection !== 'academic' ? (
                    <Button size="sm" variant="outline" onClick={() => handleEdit('academic')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave('academic')} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="degree">Degree</Label>
                    {editingSection === 'academic' ? (
                      <Input 
                        id="degree" 
                        value={editData.degree || student.degree || ''} 
                        onChange={(e) => handleInputChange('degree', e.target.value)}
                      />
                    ) : (
                      <Input id="degree" value={student.degree || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    {editingSection === 'academic' ? (
                      <Input 
                        id="branch" 
                        value={editData.branch || student.branch || ''} 
                        onChange={(e) => handleInputChange('branch', e.target.value)}
                      />
                    ) : (
                      <Input id="branch" value={student.branch || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    {editingSection === 'academic' ? (
                      <Input 
                        id="year" 
                        value={editData.year || student.year || ''} 
                        onChange={(e) => handleInputChange('year', e.target.value)}
                      />
                    ) : (
                      <Input id="year" value={student.year || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="isDiploma">Diploma Student</Label>
                    <Input id="isDiploma" value={student.isDiploma ? "Yes" : "No"} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="ssc">SSC Score</Label>
                    {editingSection === 'academic' ? (
                      <Input 
                        id="ssc" 
                        value={editData.ssc || student.ssc || ''} 
                        onChange={(e) => handleInputChange('ssc', e.target.value)}
                      />
                    ) : (
                      <Input id="ssc" value={`${student.ssc}/10`} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="hsc">HSC Score</Label>
                    {editingSection === 'academic' ? (
                      <Input 
                        id="hsc" 
                        value={editData.hsc || student.hsc || ''} 
                        onChange={(e) => handleInputChange('hsc', e.target.value)}
                      />
                    ) : (
                      <Input id="hsc" value={`${student.hsc}/10`} readOnly />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Skills & Expertise
                  </CardTitle>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resume Management */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Resume Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.resumes?.map((resume) => (
                    <div key={resume.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{resume.title}</h4>
                          <p className="text-sm text-gray-500">Updated 2 days ago</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Update
                        </Button>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-gray-600">
                    Keep your resume updated to increase your chances of getting hired. 
                    Make sure it reflects your latest skills and experiences.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 