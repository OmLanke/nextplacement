import { ColumnDef } from '@tanstack/react-table';
// Remove server-specific imports to avoid issues in client bundle
// import { createSelectSchema, students } from '@workspace/db';
// import * as z from 'zod/v4';
import { Badge } from '@workspace/ui/components/badge';
// import { Button } from '@workspace/ui/components/button';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Eye, Mail, Phone, MapPin, Calendar, GraduationCap } from 'lucide-react';

// Define the Student interface locally to avoid importing server-side code
export interface Student {
  id: number;
  email: string;
  rollNumber: string | null;
  verified: boolean;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  mothersName?: string | null;
  gender?: string | null;
  dob?: Date | null;
  personalGmail?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  profilePicture?: string | null;
  degree?: string | null;
  branch?: string | null;
  year?: string | null;
  skills?: string[] | null;
  ssc?: number | null;
  hsc?: number | null;
  isDiploma?: boolean | null;
  linkedin?: string | null;
  github?: string | null;
  createdAt?: Date;
}

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={student.profilePicture || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {student.firstName ? student.firstName.charAt(0).toUpperCase() : 
               student.email ? student.email.charAt(0).toUpperCase() : 'S'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">#{student.id}</span>
            <Badge 
              variant={student.verified ? "default" : "secondary"} 
              className={`text-xs ${student.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
            >
              {student.verified ? 'Verified' : 'Pending'}
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Student Name',
    cell: ({ row }) => {
      const student = row.original;
      const fullName = [
        student.firstName,
        student.middleName,
        student.lastName
      ].filter(Boolean).join(' ') || 'Not provided';
      
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{fullName}</span>
          <span className="text-sm text-gray-500">{student.rollNumber || 'No Roll Number'}</span>
        </div>
      );
    },
    filterFn: 'includesString',
  },
  {
    accessorKey: 'email',
    header: 'Contact Information',
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900">{student.email}</span>
          </div>
          {student.phoneNumber && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">{student.phoneNumber}</span>
            </div>
          )}
          {student.personalGmail && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">{student.personalGmail}</span>
            </div>
          )}
        </div>
      );
    },
    filterFn: 'includesString',
  },
  {
    accessorKey: 'academic',
    header: 'Academic Details',
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm">
            <GraduationCap className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900">{student.degree || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">{student.branch || 'Branch not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">{student.year || 'Year not specified'}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-gray-600">{student.address || 'Address not provided'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'skills',
    header: 'Skills',
    cell: ({ row }) => {
      const student = row.original;
      const skills = student.skills || [];
      
      if (skills.length === 0) {
        return <span className="text-sm text-gray-500">No skills listed</span>;
      }
      
      return (
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{skills.length - 3} more
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">View Details</span>
        </div>
      );
    },
  },
];
