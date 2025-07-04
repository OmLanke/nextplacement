import { Student } from './columns';
import { DataTable } from './data-table';
import { db, students } from '@workspace/db';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import { revalidatePath } from 'next/cache';
import { eq } from '@workspace/db/drizzle';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  User,
  Linkedin,
  Github,
  FileText,
  Award,
  BookOpen
} from 'lucide-react';

async function getData(): Promise<Student[]> {
  try {
    const data = await db.select().from(students);
    return data;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

async function addStudent(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '').trim();
  if (!email) return;

  const exists = await db.select().from(students).where(eq(students.email, email)).limit(1);
  if (exists.length === 0) {
    await db.insert(students).values({ email });
  }
  revalidatePath('/students');
}

async function StudentsTable() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Students Management</h1>
              <p className="text-gray-600 text-lg">Manage student profiles and track their progress</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-800">{data.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Verified</p>
                    <p className="text-3xl font-bold text-gray-800">{data.filter(s => s.verified).length}</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-gray-800">{data.filter(s => !s.verified).length}</p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-3xl font-bold text-gray-800">{data.length}</p>
                  </div>
                  <User className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Add Student Section */}
        <section className="mb-8">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <Plus className="w-5 h-5 text-blue-600" />
                Add New Student
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addStudent} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Student Email</label>
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="Enter student email address" 
                    className="h-11" 
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Student
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Students Table Section */}
        <section>
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-800 mb-1">Student Directory</CardTitle>
                  <p className="text-sm text-gray-600">
                    {data.length} {data.length === 1 ? 'student' : 'students'} in the system
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Search students..." 
                      className="pl-10 h-9 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {data.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No students yet</h3>
                  <p className="text-gray-500 mb-6">Get started by adding your first student above</p>
                  <Button className="flex items-center gap-2 mx-auto">
                    <Plus className="w-4 h-4" />
                    Add First Student
                  </Button>
                </div>
              ) : (
                <DataTable data={data} />
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  return <StudentsTable />;
}

export const dynamic = 'force-dynamic'; 