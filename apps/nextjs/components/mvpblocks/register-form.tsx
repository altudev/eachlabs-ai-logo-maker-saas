'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  User,
  Github,
  Sparkles,
  ShieldCheck,
  Palette,
  Users,
  Cloud,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (!result?.data) {
        throw new Error(result?.error?.message ?? 'Failed to create account');
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success('Account created. You are now signed in.');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerMutation.isPending) return;
    registerMutation.mutate();
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      <style jsx>{`
        .register-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          position: relative;
          overflow: hidden;
        }
        .register-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }
        .register-btn:hover::before {
          left: 100%;
        }
      `}</style>
      <div className="z-10 w-full max-w-6xl">
        <div className="bg-secondary/50 overflow-hidden rounded-[40px] shadow-2xl">
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Left side - Feature highlights */}
            <div className="bg-gradient-to-br from-primary/20 via-secondary/10 to-background relative px-10 py-12 lg:px-12">
              <div className="absolute inset-0 opacity-40">
                <div className="bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_30%)]" />
                <div className="bg-[radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.12),transparent_25%)]" />
                <div className="bg-[radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.1),transparent_30%)]" />
              </div>

              <div className="relative space-y-8">
                <div className="inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Create your account
                </div>

                <div className="space-y-4">
                  <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                    Start generating logos in seconds
                  </h1>
                  <p className="text-muted-foreground max-w-xl text-lg">
                    Join creators and teams using LogoLoco to spin up modern, minimalist logos with Better Auth secured access.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: <ShieldCheck className="h-5 w-5 text-primary" />, title: 'Secure by default', desc: 'Email + password powered by Better Auth' },
                    { icon: <Palette className="h-5 w-5 text-primary" />, title: 'Creator-ready', desc: 'Built for fast logo iterations' },
                    { icon: <Users className="h-5 w-5 text-primary" />, title: 'Team friendly', desc: 'Keep logos organized for clients' },
                    { icon: <Cloud className="h-5 w-5 text-primary" />, title: 'Always on', desc: 'Accessible anywhere you build' },
                  ].map((item) => (
                    <div key={item.title} className="border-border/60 bg-background/70 flex items-start gap-3 rounded-2xl border p-4 shadow-sm backdrop-blur">
                      <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                        {item.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/80 text-foreground rounded-2xl p-4 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Launch-ready onboarding</p>
                      <p className="text-muted-foreground text-sm">
                        Fast registration keeps you in the flow—no distractions, just ship.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Register form */}
            <div className="bg-background px-6 py-10 sm:px-10 lg:px-12">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Join LogoLoco
                  </div>
                  <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Create your account</h2>
                  <p className="text-muted-foreground text-sm">
                    Secure authentication powered by Better Auth.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium uppercase">
                      Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border-border bg-input block w-full rounded-lg border py-3 pr-4 pl-10 text-sm"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium uppercase">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-border bg-input block w-full rounded-lg border py-3 pr-4 pl-10 text-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium uppercase">
                      Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-border bg-input block w-full rounded-lg border py-3 pr-12 pl-10 text-sm"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium uppercase">
                      Confirm password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border-border bg-input block w-full rounded-lg border py-3 pr-4 pl-10 text-sm"
                        placeholder="Re-enter your password"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="register-btn relative flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-300"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="ml-2">Creating account...</span>
                    </>
                  ) : (
                    'Create account'
                  )}
                </button>

                <div className="relative text-center text-sm text-stone-500">
                  <div className="absolute inset-0 flex items-center">
                    <div className="border-border w-full border-t"></div>
                  </div>
                  <span className="relative px-2">Or continue with</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled
                    title="Social sign-up coming soon"
                    className="border-border bg-secondary text-muted-foreground flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm shadow-sm"
                  >
                    <Image
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      className="h-5 w-5"
                      alt="Google"
                      width={20}
                      height={20}
                      priority
                    />
                    <span className="ml-2">Google</span>
                  </button>
                  <button
                    type="button"
                    disabled
                    title="Social sign-up coming soon"
                    className="border-border bg-secondary text-muted-foreground flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm shadow-sm"
                  >
                    <Github className="h-5 w-5" />
                    <span className="ml-2">GitHub</span>
                  </button>
                </div>

                <div className="text-muted-foreground mt-8 text-center text-sm">
                  Already have an account?{' '}
                  <a href="/login" className="text-primary hover:text-primary/80">
                    Log in
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
