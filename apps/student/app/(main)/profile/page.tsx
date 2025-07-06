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
  AlertCircle
} from "lucide-react"

// Mock student data - in real app this would come from database
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
  profilePicture: null
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-xl text-gray-600">Manage your personal information and academic details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                      {mockStudent.firstName[0]}{mockStudent.lastName[0]}
                    </div>
                    <Button size="sm" className="absolute bottom-2 right-2 w-8 h-8 rounded-full p-0">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {mockStudent.firstName} {mockStudent.middleName} {mockStudent.lastName}
                  </h2>
                  <p className="text-gray-600 mb-4">{mockStudent.email}</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge className={mockStudent.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                      {mockStudent.verified ? (
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
                    {mockStudent.markedOut && (
                      <Badge className="bg-red-100 text-red-700">
                        Marked Out
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Roll Number: {mockStudent.rollNumber}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Academic Year</span>
                    <span className="font-medium">{mockStudent.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Branch</span>
                    <span className="font-medium">{mockStudent.branch}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SSC Score</span>
                    <span className="font-medium">{mockStudent.ssc}/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">HSC Score</span>
                    <span className="font-medium">{mockStudent.hsc}/10</span>
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
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={mockStudent.firstName} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" value={mockStudent.middleName} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={mockStudent.lastName} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={mockStudent.email} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={mockStudent.phoneNumber} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Input id="gender" value={mockStudent.gender} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" value={mockStudent.dob} readOnly />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" value={mockStudent.address} readOnly />
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
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="degree">Degree</Label>
                    <Input id="degree" value={mockStudent.degree} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Input id="branch" value={mockStudent.branch} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" value={mockStudent.year} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="isDiploma">Diploma Student</Label>
                    <Input id="isDiploma" value={mockStudent.isDiploma ? "Yes" : "No"} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="ssc">SSC Score</Label>
                    <Input id="ssc" value={`${mockStudent.ssc}/10`} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="hsc">HSC Score</Label>
                    <Input id="hsc" value={`${mockStudent.hsc}/10`} readOnly />
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
                  {mockStudent.skills.map((skill, index) => (
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
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Resume_v2.pdf</h4>
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