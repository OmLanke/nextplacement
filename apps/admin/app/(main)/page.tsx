import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import Link from "next/link"
import { db, companies } from "@workspace/db"
import { Plus, Building2, Briefcase, MapPin, DollarSign, Calendar, ExternalLink } from "lucide-react"

async function getDashboardData() {
  try {
    // Get companies with their jobs
    const result = await db.query.companies.findMany({
      with: {
        jobs: {
          where: (job, {eq}) => eq(job.active, true), // Only include active jobs
        }
      }
    })

    // Filter to only include companies that have active jobs
    const companiesWithActiveJobs = result.filter((company) => company.jobs.length > 0)

    console.log("Companies with active jobs:", companiesWithActiveJobs.length)
    return companiesWithActiveJobs
  } catch (error) {
    console.error("Database query error:", error)
    // Fallback to companies only if the relation query fails
    const companiesOnly = await db.select().from(companies)
    return companiesOnly.map((company) => ({ ...company, jobs: [] }))
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  // Calculate stats for companies with active jobs only
  const totalActiveJobs = data.reduce((acc, company) => acc + company.jobs.filter((job) => job.active).length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Companies Dashboard</h1>
              <p className="text-gray-600 text-lg">Companies with active job listings</p>
            </div>
            <Link href="/jobs/new">
              <Button className="flex items-center gap-2 px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-5 h-5" />
                Add New Job
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Companies with Active Jobs</p>
                    <p className="text-3xl font-bold text-gray-800">{data.length}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Active Jobs</p>
                    <p className="text-3xl font-bold text-gray-800">{totalActiveJobs}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Jobs per Company</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {data.length > 0 ? Math.round((totalActiveJobs / data.length) * 10) / 10 : 0}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Companies Section */}
        <section className="space-y-8">
          {data.length === 0 ? (
            <Card className="bg-white shadow-sm">
              <CardContent className="p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No companies with active jobs</h3>
                <p className="text-gray-500 mb-6">Get started by adding your first job listing</p>
                <Link href="/jobs/new">
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Job
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            data.map((company) => (
              <Card
                key={company.id}
                className="bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-gray-800">{company.name}</CardTitle>
                        {company.link && (
                          <a 
                            href={company.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-flex items-center gap-1"
                          >
                            Visit Website
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {company.jobs.filter((job) => job.active).length} active job
                        {company.jobs.filter((job) => job.active).length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                  {company.description && company.description !== "N/A" && (
                    <p className="text-sm text-gray-600 mt-3">{company.description}</p>
                  )}
                </CardHeader>

                <Separator />

                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-700">Active Job Listings</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {company.jobs
                      .filter((job) => job.active)
                      .map((job) => (
                        <Card
                          key={job.id}
                          className="group hover:shadow-lg transition-all duration-200 border border-gray-200 bg-gray-50 hover:bg-white"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-gray-800 text-sm leading-tight line-clamp-2">
                                  {job.title}
                                </h4>
                                <Badge
                                  variant="default"
                                  className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                                >
                                  Active
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                {job.location && job.location !== "N/A" && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{job.location}</span>
                                  </div>
                                )}
                                {job.salary && job.salary !== "N/A" && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <DollarSign className="w-3 h-3" />
                                    <span className="truncate">{job.salary}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>Deadline: {job.applicationDeadline.toLocaleDateString()}</span>
                                </div>
                              </div>

                              <div className="pt-2 flex items-center gap-3">
                                <Link
                                  href={`/jobs/${job.id}`}
                                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium group-hover:underline"
                                >
                                  View Job
                                </Link>
                                {job.link && (
                                  <a
                                    href={job.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800"
                                  >
                                    Company Link
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
