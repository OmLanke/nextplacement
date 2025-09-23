import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { headers } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  console.log("HELLO WORLD")
  try {
    const { filename } = await params;
    
    // Security check - prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }
    
    // Look for files in the shared uploads directory (navigate to workspace root)
    const workspaceRoot = join(process.cwd(), '..', '..');
    const filePath = join(workspaceRoot, 'shared', 'uploads', 'job-descriptions', filename);
    
    console.log('Looking for file at:', filePath);
    
    try {
      const fileBuffer = await readFile(filePath);
      
      // Determine content type based on file extension
      const ext = filename.split('.').pop()?.toLowerCase();
      let contentType = 'application/octet-stream';
      
      if (ext === 'pdf') {
        contentType = 'application/pdf';
      } else if (ext === 'txt') {
        contentType = 'text/plain';
      }
      
      // Set appropriate headers
      const response = new NextResponse(new Uint8Array(fileBuffer));
      response.headers.set('Content-Type', contentType);
      response.headers.set('Content-Disposition', `inline; filename="${filename}"`);
      
      return response;
    } catch (error) {
      console.error('File not found:', error);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}