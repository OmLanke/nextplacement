import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  Eye,
  Download,
  Share2
} from "lucide-react"

// Mock data for applications - in real app this would come from database
const mockApplications = [
  {
    id: 1,
    jobTitle: "Software Engineer Intern",
    company: "TechCorp Solutions",
    status: "pending",
    appliedDate: "2024-01-15",
    deadline: "2024-02-15",
    location: "San Francisco, CA",
    salary: "$25/hour",
    resume: "Resume_v2.pdf"
  },
  {
    id: 2,
    jobTitle: "Data Analyst",
    company: "DataFlow Inc",
    status: "reviewed",
    appliedDate: "2024-01-10",
    deadline: "2024-02-10",
    location: "New York, NY",
    salary: "$30/hour",
    resume: "Resume_v2.pdf"
  },
  {
    id: 3,
    jobTitle: "Frontend Developer",
    company: "WebSolutions",
    status: "accepted",
    appliedDate: "2024-01-05",
    deadline: "2024-02-05",
    location: "Remote",
    salary: "$28/hour",
    resume: "Resume_v2.pdf"
  },
  {
    id: 4,
    jobTitle: "Product Manager Intern",
    company: "InnovateTech",
    status: "rejected",
    appliedDate: "2024-01-01",
    deadline: "2024-02-01",
    location: "Seattle, WA",
    salary: "$32/hour",
    resume: "Resume_v2.pdf"
  }
]

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-700',
        text: 'Pending Review'
      }
    case 'reviewed':
      return {
        icon: Eye,
        color: 'bg-blue-100 text-blue-700',
        text: 'Under Review'
      }
    case 'accepted':
      return {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700',
        text: 'Accepted'
      }
    case 'rejected':
      return {
        icon: XCircle,
        color: 'bg-red-100 text-red-700',
        text: 'Rejected'
      }
    default:
      return {
        icon: AlertCircle,
        color: 'bg-gray-100 text-gray-700',
        text: 'Unknown'
      }
  }
}

export default function ApplicationsPage() {
  const statusConfig = getStatusConfig('pending')
  const StatusIcon = statusConfig.icon

  // Calculate stats
  const totalApplications = mockApplications.length
  const pendingApplications = mockApplications.filter(app => app.status === 'pending').length
  const acceptedApplications = mockApplications.filter(app => app.status === 'accepted').length
  const rejectedApplications = mockApplications.filter(app => app.status === 'rejected').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-xl text-gray-600">Track your job applications and their status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-800">{totalApplications}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingApplications}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-3xl font-bold text-green-600">{acceptedApplications}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{rejectedApplications}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          {mockApplications.map((application) => {
            const appStatusConfig = getStatusConfig(application.status)
            const AppStatusIcon = appStatusConfig.icon

            return (
              <Card key={application.id} className="bg-white shadow-sm hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.jobTitle}</h3>
                        <p className="text-blue-600 font-medium">{application.company}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Applied: {application.appliedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {application.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {application.salary}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={appStatusConfig.color}>
                        <AppStatusIcon className="w-3 h-3 mr-1" />
                        {appStatusConfig.text}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Resume: {application.resume}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Deadline: {application.deadline}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Resume
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {mockApplications.length === 0 && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications yet</h3>
              <p className="text-gray-500 mb-6">Start applying to jobs to see your applications here</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 