'use server';
import { db, companies, jobs } from '@workspace/db';

export async function createJob(formData: FormData) {
  const companyIdRaw = formData.get('companyId');
  const companyId = companyIdRaw ? Number(companyIdRaw) : undefined;
  const title = String(formData.get('title') ?? '').trim();
  const link = String(formData.get('link') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || 'N/A';
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

  if (!companyId || !title) return { error: 'Company and title are required.' };

  await db.insert(jobs).values({
    companyId,
    title,
    link,
    description,
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
  });
  return { success: true };
}

export async function createCompany(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const link = String(formData.get('link') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const imageURL = String(formData.get('imageURL') ?? '').trim() || 'https://via.placeholder.com/100x100?text=Company';
  if (!name || !email || !link || !description) return { error: 'All fields are required.' };
  const [inserted] = await db.insert(companies).values({ name, email, link, description, imageURL }).returning();
  if (!inserted) return { error: 'Failed to add company.' };
  return { success: true, company: { id: inserted.id, name: inserted.name } };
}
