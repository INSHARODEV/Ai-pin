'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { loginSchema } from '@/app/utils/zodschama';
import { MakeApiCall, Methods } from '@/app/actions';
import { userData } from '@/app/utils/user.data';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Role, User } from '../../../../shard/src/index';

export const dynamic = 'force-dynamic';

function roleHome(role?: Role) {
  switch (role) {
    case Role.SUPERVISOR:
      return '/branch';
    case Role.MANAGER:
      return '/branch';
    case Role.SELLER:
      return '/sales';
    case Role.ADMIN:
      return '/admin/companies';
    default:
      return '/';
  }
}

type Inputs = { email: string; password: string };

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const email = watch('email');
  const password = watch('password');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(p => !p);

  // If already authenticated, redirect away from /login
  useEffect(() => {
    const token =
      typeof document !== 'undefined'
        ? (document.cookie.match(/(?:^|;\s*)token=([^;]+)/)?.[1] ??
          localStorage.getItem('accessToken'))
        : null;

    if (token) {
      const saved =
        typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (saved) {
        const parsed: User = JSON.parse(saved);
        router.replace(roleHome(parsed.role));
      } else {
        try {
          const payloadPart = token.split('.')[1];
          const user: User = userData(payloadPart);
          router.replace(roleHome(user.role));
        } catch {
          router.replace('/');
        }
      }
    }
  }, [router]);

  const submit: SubmitHandler<Inputs> = async data => {
    const validated = loginSchema.safeParse(data);
    if (!validated.success) {
      setError('Please check your email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await MakeApiCall({
        body: JSON.stringify(validated.data),
        url: `/auth/signin`,
        method: Methods.POST,
        headers: 'json',
      });

      const token: string = res.data;
      if (!token) throw new Error('No token returned.');

      // Persist (localStorage for client; cookie for middleware/SSR)
      localStorage.setItem('accessToken', token);

      const payloadPart = token.split('.')[1];
      const user: User = userData(payloadPart);
      localStorage.setItem('user', JSON.stringify(user));

      // NOTE: For production, prefer HttpOnly cookies set by your API.
      document.cookie = `token=${token}; Path=/; Max-Age=2592000; SameSite=Lax`;
      document.cookie = `role=${user.role}; Path=/; Max-Age=2592000; SameSite=Lax`;

      // Use replace to prevent going back to /login
      router.replace(roleHome(user.role));
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong during login.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center flex-col p-2 
    bg-[linear-gradient(to_top_right,_rgb(3,55,101),_rgb(13,112,200),_rgb(97,108,202),_rgb(127,174,215),_rgb(94,152,203))]'
    >
      <div className='text-center text-white text-4xl font-bold'>AI Pin</div>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Welcome Back!</h2>

        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(submit)} className='space-y-5'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              {...register('email')}
              type='email'
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              required
            />
            {errors.email && (
              <p className='text-red-500 text-sm mt-1'>
                {String(errors.email.message)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <div className='relative mt-1'>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`block w-full px-3 py-2 pr-10 border ${
                  errors.password?.message
                    ? 'border-red-500'
                    : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  errors.password?.message
                    ? 'focus:ring-red-500'
                    : 'focus:ring-blue-500'
                }`}
                required
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-gray-600'
              >
                {showPassword ? (
                  <EyeOffIcon className='h-5 w-5 text-gray-400' />
                ) : (
                  <EyeIcon className='h-5 w-5 text-gray-400' />
                )}
              </button>
            </div>
            {errors.password && (
              <p className='text-red-500 text-sm mt-1'>
                {String(errors.password.message)}
              </p>
            )}
          </div>

          <button
            type='submit'
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${
              !email || !password || loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={!email || !password || loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
