import { db, companies } from '@workspace/db';
import NewJobForm from './new-job-form';

export default async function NewJobPage() {
  const companyList = await db.select().from(companies);
  return <NewJobForm companies={companyList.map((c) => ({ id: c.id, name: c.name }))} />;
}
