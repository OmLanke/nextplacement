'use client';

import React from 'react';
import { Student } from './columns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@workspace/ui/components/dialog';
import { Badge } from '@workspace/ui/components/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Separator } from '@workspace/ui/components/separator';
import { Button } from '@workspace/ui/components/button';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  User,
  Linkedin,
  Github,
  Award,
  BookOpen,
  ExternalLink,
  X,
  Edit,
  Download,
  Share2
} from 'lucide-react';
import { Switch } from '@workspace/ui/components/switch';

interface StudentDetailsModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  markoutAction: (state: boolean) => void;
}

export function StudentDetailsModal({ student, isOpen, onClose, markoutAction }: StudentDetailsModalProps) {
  const fullName = [
    student.firstName,
    student.middleName,
    student.lastName
  ].filter(Boolean).join(' ') || 'Name not provided';

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPercentage = (value: number | null) => {
    if (value === null) return 'Not provided';
    return `${value}%`;
  };

  const [markedOut, setMarkedOut] = React.useState(student.markedOut ?? false);

  React.useEffect(() => {
    setMarkedOut(student.markedOut ?? false);
  }, [student.markedOut]);

  const handleMarkoutChange = (checked: boolean) => {
    setMarkedOut(checked);
    markoutAction(checked);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Student Details
            </DialogTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={markedOut}
                  onCheckedChange={handleMarkoutChange}
                  className={
                    markedOut
                      ? 'bg-red-600 border-red-600 focus-visible:ring-red-600/50'
                      : 'bg-white border-gray-300 focus-visible:ring-gray-300/50'
                  }
                />
                <span className={markedOut ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                  Marked Out
                </span>
              </div>
              <DialogClose asChild>
                <Button variant="outline" size="icon" className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <Avatar className="w-20 h-20">
              <AvatarImage src={student.profilePicture || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                {student.firstName ? student.firstName.charAt(0).toUpperCase() : 
                 student.email ? student.email.charAt(0).toUpperCase() : 'S'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{fullName}</h2>
                <Badge 
                  variant={student.verified ? "default" : "secondary"} 
                  className={`${student.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                >
                  {student.verified ? 'Verified' : 'Pending Verification'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">ID: #{student.id}</span>
                {student.rollNumber && (
                  <span className="font-medium">Roll: {student.rollNumber}</span>
                )}
                <span className="font-medium">
                  Joined: {formatDate(new Date(Number(student.createdAt)))}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{student.email}</p>
                  </div>
                </div>

                {student.personalGmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Personal Gmail</p>
                      <p className="text-gray-900">{student.personalGmail}</p>
                    </div>
                  </div>
                )}

                {student.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone Number</p>
                      <p className="text-gray-900">{student.phoneNumber}</p>
                    </div>
                  </div>
                )}

                {student.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Address</p>
                      <p className="text-gray-900">{student.address}</p>
                    </div>
                  </div>
                )}

                {student.dob && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                      <p className="text-gray-900">{formatDate(student.dob)}</p>
                    </div>
                  </div>
                )}

                {student.gender && (
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Gender</p>
                      <p className="text-gray-900">{student.gender}</p>
                    </div>
                  </div>
                )}

                {student.mothersName && (
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Mother's Name</p>
                      <p className="text-gray-900">{student.mothersName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-600" />
                Academic Information
              </h3>
              
              <div className="space-y-3">
                {student.degree && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Degree</p>
                      <p className="text-gray-900">{student.degree}</p>
                    </div>
                  </div>
                )}

                {student.branch && (
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Branch</p>
                      <p className="text-gray-900">{student.branch}</p>
                    </div>
                  </div>
                )}

                {student.year && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Year</p>
                      <p className="text-gray-900">{student.year}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Diploma Student</p>
                    <p className="text-gray-900">{student.isDiploma ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Academic Scores */}
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-gray-700">Academic Scores</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">SSC Score</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPercentage(Number(student.ssc))}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">HSC Score</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPercentage(Number(student.hsc))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          {student.skills && student.skills.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Professional Links */}
          {(student.linkedin || student.github) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-600" />
                Professional Links
              </h3>
              <div className="flex gap-3">
                {student.linkedin && (
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Button>
                )}
                {student.github && (
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <Separator />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}