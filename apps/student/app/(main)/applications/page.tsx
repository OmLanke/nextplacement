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
import { getStudentApplications } from "../actions"

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

export default async function ApplicationsPage() {
  // Get real applications data - using student ID 1 for demo
  const { success, applications, error } = await getStudentApplications(1);
  
  // Fallback to mock data if database query fails
  const mockApplications = [
    {
      id: 1,
      job: {
        title: "Software Engineer Intern",
        company: { name: "TechCorp Solutions" },
        location: "San Francisco, CA",
        salary: "$25/hour",
        applicationDeadline: new Date("2024-02-15")
      },
      resume: { title: "Resume_v2.pdf" },
      status: "pending",
      createdAt: new Date("2024-01-15")
    },
    {
      id: 2,
      job: {
        title: "Data Analyst",
        company: { name: "DataFlow Inc" },
        location: "New York, NY",
        salary: "$30/hour",
        applicationDeadline: new Date("2024-02-10")
      },
      resume: { title: "Resume_v2.pdf" },
      status: "reviewed",
      createdAt: new Date("2024-01-10")
    },
    {
      id: 3,
      job: {
        title: "Frontend Developer",
        company: { name: "WebSolutions" },
        location: "Remote",
        salary: "$28/hour",
        applicationDeadline: new Date("2024-02-05")
      },
      resume: { title: "Resume_v2.pdf" },
      status: "accepted",
      createdAt: new Date("2024-01-05")
    },
    {
      id: 4,
      job: {
        title: "Product Manager Intern",
        company: { name: "InnovateTech" },
        location: "Seattle, WA",
        salary: "$32/hour",
        applicationDeadline: new Date("2024-02-01")
      },
      resume: { title: "Resume_v2.pdf" },
      status: "rejected",
      createdAt: new Date("2024-01-01")
    }
  ];

  const allApplications = success && applications ? applications : mockApplications;

  // Calculate stats
  const totalApplications = allApplications.length;
  const pendingApplications = allApplications.filter(app => app.status === 'pending').length;
  const acceptedApplications = allApplications.filter(app => app.status === 'accepted').length;
  const rejectedApplications = allApplications.filter(app => app.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-xl text-gray-600">Track your job applications and their status</p>
          {!success && error && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              Using demo data: {error}
            </div>
          )}
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

          {allApplications.map((application) => {
            const appStatusConfig = getStatusConfig(application.status);
            const AppStatusIcon = appStatusConfig.icon;

            return (
              <Card key={application.id} className="bg-white shadow-sm hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.job.title}</h3>
                        <p className="text-blue-600 font-medium">{application.job.company.name}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Applied: {application.createdAt.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {application.job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {application.job.salary}
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
                        Resume: {application.resume.title}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Deadline: {application.job.applicationDeadline.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {/* <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Resume
                      </Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {allApplications.length === 0 && (
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