"use client";
import { signIn } from "@workspace/auth";
import { Button } from "@workspace/ui/components/button";

export default function Login({logIn}: {logIn: () => Promise<void>}) {
  return (
    <form action={logIn}>
      <Button
        type="submit"
        variant="outline"
        className="w-full h-12"
      >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out pointer-events-none" />
      <img
        src="https://static.cdnlogo.com/logos/g/35/google-icon.svg"
        alt="Google logo"
        className="w-5 h-5 transition-transform duration-200"
      />
      <span className="relative z-10 font-medium transition-colors duration-200 group-hover:text-foreground">
        Sign in with Google
      </span>
      </Button>
    </form>
  );
}
