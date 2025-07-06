'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
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
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  X
} from "lucide-react"
import { getStudentProfile, updateStudentProfile } from "../actions"

// Optional fallback student object to avoid UI crashes during development
const mockStudent = null;

export default function ProfilePage() {
  const [student, setStudent] = useState<any | null>(mockStudent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [editingSkills, setEditingSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [editingGrades, setEditingGrades] = useState<any[]>([]);
  const [editingInternships, setEditingInternships] = useState<any[]>([]);
  const [editingResumes, setEditingResumes] = useState<any[]>([]);
  const [newInternship, setNewInternship] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [newResume, setNewResume] = useState({
    title: '',
    link: ''
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.studentId) {
      loadStudentProfile(session.user.studentId);
    }
  }, [status, session]);

  const loadStudentProfile = async (id: number) => {
    try {
      const result = await getStudentProfile(id);
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
        setStudent((prev: Record<string, any> | null) => ({ ...(prev || {}), ...editData }));
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
    setEditData((prev: Record<string, any>) => ({ ...prev, [field]: value }));
  };

  const handleInputChangeWithType = (field: string, value: string, type: 'string' | 'number' | 'boolean' = 'string') => {
    let processedValue: any = value;
    if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    } else if (type === 'boolean') {
      processedValue = value === 'true';
    }
    setEditData((prev: Record<string, any>) => ({ ...prev, [field]: processedValue }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !editingSkills.includes(newSkill.trim())) {
      setEditingSkills([...editingSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditingSkills(editingSkills.filter(skill => skill !== skillToRemove));
  };

  const saveSkills = async () => {
    setIsSaving(true);
    try {
      const result = await updateStudentProfile(student.id, { skills: editingSkills });
      if (result.success) {
        setStudent((prev: Record<string, any> | null) => ({ ...(prev || {}), skills: editingSkills }));
        setEditingSection(null);
      } else {
        setError(result.error || 'Failed to update skills');
      }
    } catch (err) {
      setError('Failed to update skills');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSkills = () => {
    setEditingSkills(student.skills || []);
    setEditingSection('skills');
  };

  const handleEditGrades = () => {
    setEditingGrades(student.grades || []);
    setEditingSection('grades');
  };

  const handleEditInternships = () => {
    setEditingInternships(student.internships || []);
    setEditingSection('internships');
  };

  const handleEditResumes = () => {
    setEditingResumes(student.resumes || []);
    setEditingSection('resumes');
  };

  const updateGrade = (sem: number, field: string, value: any) => {
    setEditingGrades(prev => 
      prev.map(grade => 
        grade.sem === sem ? { ...grade, [field]: value } : grade
      )
    );
  };

  const addInternship = () => {
    if (newInternship.title && newInternship.company) {
      setEditingInternships([...editingInternships, { ...newInternship, id: Date.now() }]);
      setNewInternship({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
  };

  const removeInternship = (id: number) => {
    setEditingInternships(editingInternships.filter(intern => intern.id !== id));
  };

  const addResume = () => {
    if (newResume.title && newResume.link) {
      setEditingResumes([...editingResumes, { ...newResume, id: Date.now() }]);
      setNewResume({ title: '', link: '' });
    }
  };

  const removeResume = (id: number) => {
    setEditingResumes(editingResumes.filter(resume => resume.id !== id));
  };

  const saveGrades = async () => {
    setIsSaving(true);
    try {
      const result = await updateStudentProfile(student.id, { grades: editingGrades });
      if (result.success) {
        setStudent((prev: Record<string, any> | null) => ({ ...(prev || {}), grades: editingGrades }));
        setEditingSection(null);
      } else {
        setError(result.error || 'Failed to update grades');
      }
    } catch (err) {
      setError('Failed to update grades');
    } finally {
      setIsSaving(false);
    }
  };

  const saveInternships = async () => {
    setIsSaving(true);
    try {
      const result = await updateStudentProfile(student.id, { internships: editingInternships });
      if (result.success) {
        setStudent((prev: Record<string, any> | null) => ({ ...(prev || {}), internships: editingInternships }));
        setEditingSection(null);
      } else {
        setError(result.error || 'Failed to update internships');
      }
    } catch (err) {
      setError('Failed to update internships');
    } finally {
      setIsSaving(false);
    }
  };

  const saveResumes = async () => {
    setIsSaving(true);
    try {
      const result = await updateStudentProfile(student.id, { resumes: editingResumes });
      if (result.success) {
        setStudent((prev: Record<string, any> | null) => ({ ...(prev || {}), resumes: editingResumes }));
        setEditingSection(null);
      } else {
        setError(result.error || 'Failed to update resumes');
      }
    } catch (err) {
      setError('Failed to update resumes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // In a real app, you'd upload to cloud storage and get a URL
        // For now, we'll create a mock URL
        const mockUrl = URL.createObjectURL(file);
        const newResumeItem = {
          id: Date.now(),
          title: file.name,
          link: mockUrl
        };
        setEditingResumes(prev => [...prev, newResumeItem]);
      }
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const mockUrl = URL.createObjectURL(file);
        const newResumeItem = {
          id: Date.now(),
          title: file.name,
          link: mockUrl
        };
        setEditingResumes(prev => [...prev, newResumeItem]);
      }
    });
  };

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No profile data found.</p>
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
                    {student.linkedin && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => window.open(student.linkedin, '_blank')}
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn Profile
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </Button>
                    )}
                    {student.github && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => window.open(student.github, '_blank')}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub Profile
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </Button>
                    )}
                    {(!student.linkedin && !student.github) && (
                      <p className="text-sm text-gray-500 text-center">No social links added yet</p>
                    )}
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
                    <Label htmlFor="mothersName">Mother's Name</Label>
                    {editingSection === 'personal' ? (
                      <Input 
                        id="mothersName" 
                        value={editData.mothersName || student.mothersName || ''} 
                        onChange={(e) => handleInputChange('mothersName', e.target.value)}
                      />
                    ) : (
                      <Input id="mothersName" value={student.mothersName || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="personalGmail">Personal Email</Label>
                    {editingSection === 'personal' ? (
                      <Input 
                        id="personalGmail" 
                        value={editData.personalGmail || student.personalGmail || ''} 
                        onChange={(e) => handleInputChange('personalGmail', e.target.value)}
                      />
                    ) : (
                      <Input id="personalGmail" value={student.personalGmail || ''} readOnly />
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
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    {editingSection === 'personal' ? (
                      <Input 
                        id="linkedin" 
                        value={editData.linkedin || student.linkedin || ''} 
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    ) : (
                      <Input id="linkedin" value={student.linkedin || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub Profile</Label>
                    {editingSection === 'personal' ? (
                      <Input 
                        id="github" 
                        value={editData.github || student.github || ''} 
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        placeholder="https://github.com/yourusername"
                      />
                    ) : (
                      <Input id="github" value={student.github || ''} readOnly />
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
                      <Select 
                        value={editData.degree || student.degree || ''} 
                        onValueChange={(value) => handleInputChange('degree', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bachelor of Technology">Bachelor of Technology</SelectItem>
                          <SelectItem value="Bachelor of Engineering">Bachelor of Engineering</SelectItem>
                          <SelectItem value="Master of Technology">Master of Technology</SelectItem>
                          <SelectItem value="Master of Engineering">Master of Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="degree" value={student.degree || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    {editingSection === 'academic' ? (
                      <Select 
                        value={editData.branch || student.branch || ''} 
                        onValueChange={(value) => handleInputChange('branch', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Information Technology">Information Technology</SelectItem>
                          <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                          <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                          <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="branch" value={student.branch || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    {editingSection === 'academic' ? (
                      <Select 
                        value={editData.year || student.year || ''} 
                        onValueChange={(value) => handleInputChange('year', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="year" value={student.year || ''} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="isDiploma">Diploma Student</Label>
                    {editingSection === 'academic' ? (
                      <Select 
                        value={editData.isDiploma?.toString() || student.isDiploma?.toString() || 'false'} 
                        onValueChange={(value) => handleInputChangeWithType('isDiploma', value, 'boolean')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="isDiploma" value={student.isDiploma ? "Yes" : "No"} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="ssc">SSC Score</Label>
                    {editingSection === 'academic' ? (
                      <Input 
                        id="ssc" 
                        value={editData.ssc || student.ssc || ''} 
                        onChange={(e) => handleInputChangeWithType('ssc', e.target.value, 'number')}
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="0.00"
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
                        onChange={(e) => handleInputChangeWithType('hsc', e.target.value, 'number')}
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="0.00"
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
                  {editingSection !== 'skills' ? (
                    <Button size="sm" variant="outline" onClick={handleEditSkills}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveSkills} disabled={isSaving}>
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
                {editingSection === 'skills' ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a new skill"
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button size="sm" onClick={addSkill} disabled={!newSkill.trim()}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editingSkills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 flex items-center gap-1">
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {student.skills?.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                    {(!student.skills || student.skills.length === 0) && (
                      <p className="text-sm text-gray-500">No skills added yet</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Academic Performance (SGPI) */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Academic Performance (SGPI)
                  </CardTitle>
                  {editingSection !== 'grades' ? (
                    <Button size="sm" variant="outline" onClick={handleEditGrades}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveGrades} disabled={isSaving}>
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
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Semester</th>
                      <th className="text-left py-2">SGPI</th>
                      <th className="text-left py-2">KT</th>
                      <th className="text-left py-2">Dead KT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(editingSection === 'grades' ? editingGrades : student.grades)?.map((grade: any) => (
                      <tr key={grade.sem} className="border-t">
                        <td className="py-2">{grade.sem}</td>
                        <td className="py-2">
                          {editingSection === 'grades' ? (
                            <Input
                              value={grade.sgpi || ''}
                              onChange={(e) => updateGrade(grade.sem, 'sgpi', parseFloat(e.target.value) || 0)}
                              type="number"
                              step="1"
                              min="0"
                              max="10"
                              className="w-20"
                            />
                          ) : (
                            grade.sgpi
                          )}
                        </td>
                        <td className="py-2">
                          {editingSection === 'grades' ? (
                            <Select
                              value={grade.isKT?.toString() || 'false'}
                              onValueChange={(value) => updateGrade(grade.sem, 'isKT', value === 'true')}
                            >
                              <SelectTrigger className="w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            grade.isKT ? 'Yes' : 'No'
                          )}
                        </td>
                        <td className="py-2">
                          {editingSection === 'grades' ? (
                            <Select
                              value={grade.deadKT?.toString() || 'false'}
                              onValueChange={(value) => updateGrade(grade.sem, 'deadKT', value === 'true')}
                            >
                              <SelectTrigger className="w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            grade.deadKT ? 'Yes' : 'No'
                          )}
                        </td>
                      </tr>
                    ))}
                    {(() => {
                      const gradesToShow = editingSection === 'grades' ? editingGrades : student.grades;
                      return !gradesToShow || gradesToShow.length === 0;
                    })() && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500">
                          No grades recorded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Internships */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Internships
                  </CardTitle>
                  {editingSection !== 'internships' ? (
                    <Button size="sm" variant="outline" onClick={handleEditInternships}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveInternships} disabled={isSaving}>
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
                {editingSection === 'internships' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={newInternship.title}
                          onChange={(e) => setNewInternship(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Software Engineer Intern"
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={newInternship.company}
                          onChange={(e) => setNewInternship(prev => ({ ...prev, company: e.target.value }))}
                          placeholder="Google"
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={newInternship.location}
                          onChange={(e) => setNewInternship(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Mountain View, CA"
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={newInternship.startDate}
                          onChange={(e) => setNewInternship(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={newInternship.endDate}
                          onChange={(e) => setNewInternship(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={newInternship.description}
                          onChange={(e) => setNewInternship(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your role and achievements..."
                        />
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full" onClick={addInternship}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Internship
                    </Button>
                    <div className="space-y-4">
                      {editingInternships.map((intern: any) => (
                        <div key={intern.id} className="p-4 border border-gray-200 rounded-lg relative">
                          <button
                            onClick={() => removeInternship(intern.id)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              {intern.title} @ {intern.company}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {intern.startDate && intern.endDate && 
                                `${new Date(intern.startDate).toLocaleDateString()} - ${new Date(intern.endDate).toLocaleDateString()}`
                              }
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{intern.location}</p>
                          <p className="text-sm text-gray-700 mt-2">{intern.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(editingSection === 'internships' ? editingInternships : student.internships)?.map((intern: any) => (
                      <div key={intern.id ?? `${intern.title}-${intern.company}`} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {intern.title} @ {intern.company}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(intern.startDate).toLocaleDateString()} - {new Date(intern.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{intern.location}</p>
                        <p className="text-sm text-gray-700 mt-2">{intern.description}</p>
                      </div>
                    ))}
                    {(() => {
                      const internshipsToShow = editingSection === 'internships' ? editingInternships : student.internships;
                      return !internshipsToShow || internshipsToShow.length === 0;
                    })() && (
                      <p className="text-sm text-gray-600">No internships added yet.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resume Management */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Resume Management
                  </CardTitle>
                  {editingSection !== 'resumes' ? (
                    <Button size="sm" variant="outline" onClick={handleEditResumes}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveResumes} disabled={isSaving}>
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
                {editingSection === 'resumes' ? (
                  <div className="space-y-4">
                    {/* Drag and Drop Zone */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragOver 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drop your resume here
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        or click to browse files (PDF only)
                      </p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      >
                        Choose File
                      </label>
                    </div>

                    {/* Manual Add Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Resume Title</Label>
                        <Input
                          value={newResume.title}
                          onChange={(e) => setNewResume(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="My Resume v2"
                        />
                      </div>
                      <div>
                        <Label>Resume Link</Label>
                        <Input
                          value={newResume.link}
                          onChange={(e) => setNewResume(prev => ({ ...prev, link: e.target.value }))}
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full" onClick={addResume}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Resume
                    </Button>
                    <div className="space-y-4">
                      {editingResumes.map((resume: any) => (
                        <div key={resume.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg relative">
                          <button
                            onClick={() => removeResume(resume.id)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{resume.title}</h4>
                              <p className="text-sm text-gray-500">Ready to save</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open(resume.link, '_blank')}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(editingSection === 'resumes' ? editingResumes : student.resumes)?.map((resume: any) => (
                      <div key={resume.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <h4 className="font-medium">{resume.title}</h4>
                            <p className="text-sm text-gray-500">Updated 2 days ago</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(resume.link, '_blank')}
                          >
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
                    {(() => {
                      const resumesToShow = editingSection === 'resumes' ? editingResumes : student.resumes;
                      return !resumesToShow || resumesToShow.length === 0;
                    })() && (
                      <p className="text-sm text-gray-600">No resumes uploaded yet.</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Keep your resume updated to increase your chances of getting hired. 
                      Make sure it reflects your latest skills and experiences.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 