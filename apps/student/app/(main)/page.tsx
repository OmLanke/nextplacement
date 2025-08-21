import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import Link from "next/link"
import { db, companies, jobs, students } from "@workspace/db"
import { 
  Building2, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ExternalLink,
  TrendingUp,
  Users,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Search,
  Filter,
  Bookmark,
  Share2,
  Eye,
  AlertCircle
} from "lucide-react"

async function getDashboardData() {
  try {
    // Get companies with their active jobs
    const result = await db.query.companies.findMany({
      with: {
        jobs: {
          where: (job, {eq}) => eq(job.active, true),
        }
      }
    })

    // Filter to only include companies that have active jobs
    const companiesWithActiveJobs = result.filter((company) => company.jobs.length > 0)

    // Get total student count for stats
    const studentCount = await db.select().from(students)
    
    return {
      companies: companiesWithActiveJobs,
      totalStudents: studentCount.length,
      success: true
    }
  } catch (error) {
    console.error("Database query error:", error)
    return {
      companies: [],
      totalStudents: 0,
      success: false,
      error: "Failed to load dashboard data"
    }
  }
}

export default async function DashboardPage() {
  const { companies: data, totalStudents, success, error } = await getDashboardData()

  // Calculate stats
  const totalActiveJobs = data.reduce((acc, company) => acc + company.jobs.filter((job) => job.active).length, 0)
  const featuredCompanies = data.slice(0, 3) // Top 3 companies for featured section
  const recentJobs = data.flatMap(company => 
    company.jobs.slice(0, 2).map(job => ({ ...job, company }))
  ).slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Your Dream Career
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Explore opportunities from top companies and find the perfect role that matches your skills and aspirations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
                  <Search className="w-5 h-5 mr-2" />
                  Browse All Jobs
                </Button>
              </Link>
              <Link href="/applications">
                <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white/10 hover:text-black px-8 py-3 text-lg font-semibold">
                  <Bookmark className="w-5 h-5 mr-2" />
                  My Applications
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!success && error && (
            <div className="mb-8 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              Using demo data: {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{data.length}</h3>
              <p className="text-gray-600">Active Companies</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{totalActiveJobs}</h3>
              <p className="text-gray-600">Open Positions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{totalStudents}</h3>
              <p className="text-gray-600">Students</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Companies</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Top companies actively hiring talented students like you
            </p>
          </div>

          {featuredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCompanies.map((company) => (
                <Card key={company.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white opacity-80" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{company.name}</h3>
                        <p className="text-gray-600 text-sm">{company.email}</p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {company.jobs.length} jobs
                      </Badge>
                    </div>
                    
                    {company.description && company.description !== "N/A" && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{company.description}</p>
                    )}
                    
                    <div className="space-y-2 mb-6">
                      {company.jobs.slice(0, 2).map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{job.title}</h4>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                              {job.location && job.location !== "N/A" && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {job.location}
                                </span>
                              )}
                              {job.salary && job.salary !== "N/A" && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {job.salary}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href="/jobs">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                          View All Jobs
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white shadow-sm">
              <CardContent className="p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No featured companies yet</h3>
                <p className="text-gray-500 mb-6">Check back later for exciting opportunities</p>
                <Link href="/jobs">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Browse All Jobs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Recent Job Opportunities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Opportunities</h2>
              <p className="text-xl text-gray-600">Latest job postings from top companies</p>
            </div>
            <Link href="/jobs">
              <Button variant="outline" className="hidden md:flex">
                <Filter className="w-4 h-4 mr-2" />
                Filter Jobs
              </Button>
            </Link>
          </div>

          {recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentJobs.map((job) => (
                <Card key={job.id} className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-blue-600 font-medium">{job.company.name}</p>
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

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {job.location && job.location !== "N/A" && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.salary && job.salary !== "N/A" && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Deadline: {job.applicationDeadline.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Min CGPA: {job.minCGPA}</span>
                      </div>
                    </div>

                    {job.description && job.description !== "N/A" && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Link href="/jobs">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Apply Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                        {job.link && (
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white shadow-sm">
              <CardContent className="p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No recent opportunities</h3>
                <p className="text-gray-500 mb-6">Check back later for new job postings</p>
                <Link href="/jobs">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Browse All Jobs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-12">
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="px-8 py-3">
                View All Opportunities
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Career Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have found their dream jobs through Placement Portal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profile">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
                Create Your Profile
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg hover:text-black text-primary font-semibold">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export const dynamic = "force-dynamic"
