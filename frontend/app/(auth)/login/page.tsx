'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { loginSchema } from '@/app/utils/zodschama';
import { MakeApiCall, Methods } from '@/app/actions';
import { userData } from '@/app/utils/user.data';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Role, User } from '../../../../shard/src/index';

type Inputs = {
  email: string;
  password: string;
};

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submit: SubmitHandler<Inputs> = async (data: any) => {
    const valdidatedData = loginSchema.safeParse(data);
    console.log(email, password);

    try {
      setLoading(true);
      const res = await MakeApiCall({
        body: JSON.stringify(valdidatedData.data),
        url: `/auth/signin`,
        method: Methods.POST,
        headers: 'json',
      });

      console.log(process.env.NEXT_PUBLIC_BASE_URL);
      localStorage.setItem('accessToken', res.data);

      console.log('res', res);
      localStorage.setItem('accessToken', res.data);
      const payloadPart = res.data.split('.')[1];
      const user: User = userData(payloadPart);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user', JSON.stringify(user));
      console.log(user.role);
      switch (user.role) {
        case Role.SUPERVISOR:
          router.push('/branch');
          break;
        case Role.SELLER:
          router.push('/sales');
          break;
        case Role.ADMIN:
          router.push('/admin');
          break;
      }
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
      <div className=' text-center text-white text-4xl font-bold'> AI Pin</div>
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
                {errors.email.message as any}
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
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'
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
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${
              error || !email || !password || loading
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
