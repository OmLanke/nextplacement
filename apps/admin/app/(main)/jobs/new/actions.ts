'use server';
import { db, companies, jobs } from '@workspace/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function createJob(formData: FormData) {
  const companyIdRaw = formData.get('companyId');
  const companyId = companyIdRaw ? Number(companyIdRaw) : undefined;
  const title = String(formData.get('title') ?? '').trim();
  const link = String(formData.get('link') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || '';
  const location = String(formData.get('location') ?? '').trim() || 'N/A';
  const imageURL =
    String(formData.get('imageURL') ?? '').trim() || 'https://via.placeholder.com/100x100?text=Job';
  const salary = String(formData.get('salary') ?? '').trim() || 'N/A';
  const deadlineRaw = formData.get('applicationDeadline');
  const applicationDeadline = deadlineRaw ? new Date(String(deadlineRaw)) : new Date();
  const minCGPA = formData.get('minCGPA') !== null ? String(formData.get('minCGPA')) : '0';
  const minSSC = formData.get('minSSC') !== null ? String(formData.get('minSSC')) : '0';
  const minHSC = formData.get('minHSC') !== null ? String(formData.get('minHSC')) : '0';
  const allowDeadKT = formData.get('allowDeadKT') === 'on' || formData.get('allowDeadKT') === 'true';
  const allowLiveKT = formData.get('allowLiveKT') === 'on' || formData.get('allowLiveKT') === 'true';

  // Handle file upload
  const descriptionFile = formData.get('descriptionFile') as File | null;
  const fileType = formData.get('fileType') as string | null;
  
  let fileUrl: string | null = null;
  let fileName: string | null = null;

  if (descriptionFile && descriptionFile.size > 0) {
    try {
      // Create uploads directory in shared location if it doesn't exist
      const uploadsDir = join(process.cwd(), 'shared', 'uploads', 'job-descriptions');
      await mkdir(uploadsDir, { recursive: true });

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = descriptionFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      fileName = `${timestamp}_${originalName}`;
      const filePath = join(uploadsDir, fileName);

      // Write file to disk
      const bytes = await descriptionFile.arrayBuffer();
      await writeFile(filePath, Buffer.from(bytes));

      // Set file URL for database
      fileUrl = `/uploads/job-descriptions/${fileName}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      return { error: 'Failed to upload description file.' };
    }
  }

  if (!companyId || !title) return { error: 'Company and title are required.' };
  
  // Either description text OR file is required
  if (!description && !descriptionFile) {
    return { error: 'Either description text or description file is required.' };
  }

  await db.insert(jobs).values({
    companyId,
    title,
    link,
    description: description || null,
    location,
    imageURL,
    salary,
    applicationDeadline,
    active: true,
    minCGPA,
    minSSC,
    minHSC,
    allowDeadKT,
    allowLiveKT,
    fileType: fileType || null,
    fileUrl: fileUrl || null,
    fileName: fileName || null,
  });
  return { success: true };
}

export async function createCompany(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const link = String(formData.get('link') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const imageURL = String(formData.get('imageURL') ?? '').trim() || 'https://via.placeholder.com/100x100?text=Company';
  if (!name || !link || !description) return { error: 'Name, link, and description are required.' };
  const [inserted] = await db.insert(companies).values({ name, link, description, imageURL }).returning();
  if (!inserted) return { error: 'Failed to add company.' };
  return { success: true, company: { id: inserted.id, name: inserted.name } };
}
