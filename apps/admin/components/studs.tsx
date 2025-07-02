import { Button } from '@workspace/ui/components/button';
import { auth } from '@/auth';

export default async function Studs({
  action,
  logOut,
}: {
  action: () => void;
  logOut: () => void;
}) {
  const session = await auth();
  if (!session?.user) return null;
  return (
    <div className="flex gap-2">
      <Button onClick={action} variant="outline">
        Click me
      </Button>
      <Button onClick={logOut}>Sign Out</Button>
    </div>
  );
}
