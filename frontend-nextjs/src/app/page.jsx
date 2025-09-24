'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from './lib/apiService';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  const handleLogin = async (e) => {
    setLoadingLogin(true);
    e.preventDefault();
    console.log(username);
    try {
      setError('');
      await apiService.login(username, password);
      router.push('/dashboard');
      setLoadingLogin(false);
    } catch (err) {
      setLoadingLogin(false);
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Username atau password salah');
    }
  };

  const handleRegister = async (e) => {
    setLoadingRegister(true);
    e.preventDefault();
    try {
      setError('');
      await apiService.register(username, password);
      await apiService.login(username, password);
      router.push('/dashboard');
      setLoadingRegister(false);
    } catch (err) {
      setLoadingRegister(false);
      console.error('Register error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Gagal daftar akun');
    }
  };

  return (
    <div className="h-screen w-screen bg-amber-200 flex justify-center items-center">
      <div className="min-w-[400px] min-h-[300px] bg-white rounded-2xl flex flex-col text-black p-4 gap-5">
        <h1 className="font-bold text-2xl">Ganapatih feed</h1>

        <div className="mb-2">
          <input
            suppressHydrationWarning
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="username"
            required
          />
        </div>

        <div className="mb-2">
          <input
            suppressHydrationWarning
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="password"
            required
          />
        </div>

        <div className="grid grid-cols-2 justify-center gap-2 mx-4 py-2 ">
          <button
            onClick={handleLogin}
            disabled={loadingLogin}
            className="hover:cursor-pointer flex col-span-1 border border-blue-600 
                   hover:border-b-2 hover:scale-y-105 duration-100 justify-center  
                   rounded-md py-1 disabled:opacity-50"
          >
            {loadingLogin ? 'Loading...' : 'Masuk'}
          </button>

          <button
            onClick={handleRegister}
            disabled={loadingRegister}
            className="hover:cursor-pointer flex col-span-1 justify-center border rounded-md py-1 disabled:opacity-50"
          >
            {loadingRegister ? 'Loading...' : 'Daftar'}
          </button>
        </div>

        {error && (
          <div className="flex text-red-500 text-sm font-medium justify-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
