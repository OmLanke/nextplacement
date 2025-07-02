import { Button } from '@workspace/ui/components/button';
import { signIn } from '@/auth';

async function logIn() {
  'use server';
  await signIn('google', { redirectTo: '/' });
}

export default async function Page() {
  return (
    <div className="relative min-h-svh flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-red-100 to-pink-100 transition-colors duration-500">
      {/* Animated floating shapes */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-rose-200/40 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-blue-200/30 rounded-full blur-2xl animate-float-medium" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-red-300/30 rounded-full blur-2xl animate-float-fast" />
      </div>
      <div className="relative z-10 backdrop-blur-md bg-white/70 rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-8 border border-white/30 max-w-sm w-full transition-all duration-300 hover:shadow-[0_0_32px_4px_rgba(239,68,68,0.25)] hover:border-red-400/60">
        <div className="flex flex-col items-center gap-2">
          {/* Animated logo */}
          <img src="/favicon.ico" alt="Logo" className="w-14 h-14 mb-2 drop-shadow-lg animate-bounce-slow" />
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Placement Portal Admin</h1>
          <p className="text-gray-500 text-sm text-center">Sign in to manage placements and students</p>
          <p className="text-xs text-red-500 font-semibold italic mt-1 animate-fade-in">Empower your journey. Shape the future.</p>
        </div>
        <form action={logIn} className="w-full">
          <Button type="submit" variant="outline" className="w-full h-12 relative overflow-hidden group rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-red-400">
            <span className="absolute inset-0 bg-gradient-to-r from-red-200/0 via-red-200/20 to-red-200/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out pointer-events-none" />
            <img
              src="https://static.cdnlogo.com/logos/g/35/google-icon.svg"
              alt="Google logo"
              className="w-5 h-5 mr-2 inline-block align-middle"
            />
            <span className="relative z-10 font-medium transition-colors duration-200 group-hover:text-red-700 group-hover:drop-shadow-md">
              Sign in with Google
            </span>
            {/* Button ripple effect */}
            <span className="absolute left-1/2 top-1/2 w-0 h-0 bg-red-300/40 rounded-full opacity-0 group-active:opacity-100 group-active:w-32 group-active:h-32 group-active:animate-ripple -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          </Button>
        </form>
      </div>
    </div>
  );
}
