import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock,
  Search,
  Filter,
  Bookmark,
  Share2,
  Eye,
  ArrowRight,
  Briefcase,
  Users,
  Star,
  CheckCircle,
  ExternalLink
} from "lucide-react"
import { db, jobs, companies } from "@workspace/db"
import { eq } from "drizzle-orm"
import JobApplicationModal from "../../components/job-application-modal"

async function getJobsData() {
  try {
    const availableJobs = await db.query.jobs.findMany({
      where: eq(jobs.active, true),
      with: {
        company: true
      }
    });

    return availableJobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobsData();

  // Mock data for demonstration
  const mockJobs = [
    {
      id: 1,
      title: "Software Engineer Intern",
      company: {
        name: "TechCorp Solutions",
        email: "careers@techcorp.com"
      },
      location: "San Francisco, CA",
      salary: "$25/hour",
      description: "Join our dynamic team and work on cutting-edge projects. We're looking for passionate developers who love to learn and grow.",
      applicationDeadline: new Date("2024-02-15"),
      minCGPA: 7.5,
      active: true,
      link: "https://techcorp.com/careers"
    },
    {
      id: 2,
      title: "Data Analyst",
      company: {
        name: "DataFlow Inc",
        email: "hr@dataflow.com"
      },
      location: "New York, NY",
      salary: "$30/hour",
      description: "Analyze large datasets and provide insights to drive business decisions. Experience with Python and SQL required.",
      applicationDeadline: new Date("2024-02-10"),
      minCGPA: 7.0,
      active: true,
      link: "https://dataflow.com/jobs"
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: {
        name: "WebSolutions",
        email: "jobs@websolutions.com"
      },
      location: "Remote",
      salary: "$28/hour",
      description: "Build beautiful and responsive user interfaces. Strong knowledge of React, TypeScript, and modern CSS required.",
      applicationDeadline: new Date("2024-02-05"),
      minCGPA: 7.2,
      active: true,
      link: "https://websolutions.com/careers"
    },
    {
      id: 4,
      title: "Product Manager Intern",
      company: {
        name: "InnovateTech",
        email: "careers@innovatetech.com"
      },
      location: "Seattle, WA",
      salary: "$32/hour",
      description: "Work closely with cross-functional teams to define product requirements and drive product development.",
      applicationDeadline: new Date("2024-02-01"),
      minCGPA: 7.8,
      active: true,
      link: "https://innovatetech.com/jobs"
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: {
        name: "CloudTech Systems",
        email: "hr@cloudtech.com"
      },
      location: "Austin, TX",
      salary: "$35/hour",
      description: "Manage cloud infrastructure and deployment pipelines. Experience with AWS, Docker, and Kubernetes preferred.",
      applicationDeadline: new Date("2024-02-20"),
      minCGPA: 7.0,
      active: true,
      link: "https://cloudtech.com/careers"
    },
    {
      id: 6,
      title: "UX/UI Designer",
      company: {
        name: "DesignStudio",
        email: "jobs@designstudio.com"
      },
      location: "Los Angeles, CA",
      salary: "$26/hour",
      description: "Create intuitive and beautiful user experiences. Proficiency in Figma, Adobe Creative Suite, and user research methods.",
      applicationDeadline: new Date("2024-02-12"),
      minCGPA: 7.5,
      active: true,
      link: "https://designstudio.com/jobs"
    }
  ];

  const allJobs = [...jobs, ...mockJobs];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-xl text-gray-600">Find the perfect opportunity that matches your skills and aspirations</p>
        </div>

        {/* Search and Filter Section */}
        <Card className="bg-white shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search jobs by title, company, or skills..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="san-francisco">San Francisco</SelectItem>
                    <SelectItem value="new-york">New York</SelectItem>
                    <SelectItem value="seattle">Seattle</SelectItem>
                    <SelectItem value="austin">Austin</SelectItem>
                    <SelectItem value="los-angeles">Los Angeles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-800">{allJobs.length}</p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Companies</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {new Set(allJobs.map(job => job.company.name)).size}
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Remote Jobs</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {allJobs.filter(job => job.location.toLowerCase().includes('remote')).length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Salary</p>
                  <p className="text-3xl font-bold text-gray-800">$28/hr</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allJobs.map((job) => (
            <Card key={job.id} className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-blue-600 font-medium mb-2">{job.company.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Deadline: {job.applicationDeadline.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4" />
                    <span>Min CGPA: {job.minCGPA}</span>
                  </div>
                </div>

                                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <JobApplicationModal 
                        job={job}
                        studentId={1} // Mock student ID - in real app this would come from auth
                        resumes={[
                          { id: 1, title: "Resume_v2.pdf", link: "/resumes/resume_v2.pdf" },
                          { id: 2, title: "Resume_Updated.pdf", link: "/resumes/resume_updated.pdf" }
                        ]}
                      />
                      {job.link && (
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      )}
                    </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8 py-3">
            Load More Jobs
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Empty State */}
        {allJobs.length === 0 && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria or check back later for new opportunities</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 