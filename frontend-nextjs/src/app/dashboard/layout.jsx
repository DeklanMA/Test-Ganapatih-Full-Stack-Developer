'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import apiService from '../lib/apiService';
import { RefreshProvider, useRefresh } from '../lib/useContext';

function LayoutContent({ children }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const { setRefreshKey } = useRefresh();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);

    const loadSuggested = async () => {
      try {
        const res = await apiService.getSuggestedUsers();
        setUsers(res.users || []);
      } catch (err) {
        console.error('Gagal load suggested users:', err);
      }
    };
    loadSuggested();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleFollowToggle = async (userId, isFollowed) => {
    try {
      if (isFollowed) {
        await apiService.unfollowUser(userId);
      } else {
        await apiService.followUser(userId);
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_followed: !isFollowed } : u
        )
      );
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error('Gagal toggle follow:', err);
    }
  };

  return (
    <div className="max-w-[1300px] flex mx-auto">
      <main className="grid grid-cols-4 gap-5 w-full h-full justify-center ">
        <div className="col-span-1 sticky top-0 h-screen">
          <div className="flex flex-row gap-5 mx-8 justify-center my-10 h-24 items-center">
            <Image
              src="/profile.png"
              width={100}
              height={100}
              alt="profile"
              className="w-24 h-24 rounded-full"
            />
            <div className="flex items-center ">
              <h1 className="font-bold text-white">{username || 'Guest'}</h1>
            </div>
            <div className="relative flex justify-end w-full group cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-ellipsis-vertical"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
              <div className="hidden group-hover:block absolute top-4 -left-20 mt-2 w-40 bg-white rounded-lg shadow-lg border p-2">
                <ul className="text-sm text-gray-700">
                  <li
                    onClick={handleLogout}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 border border-gray-500 border-t-0 border-b-0 h-full">
          {children}
        </div>

        <div className="col-span-1 sticky top-0 h-screen">
          <div className="flex flex-col gap-2 border-white border w-80 mt-24 p-4 rounded-xl">
            <h1 className="font-bold text-xl">Untuk Diikuti</h1>
            <div className="flex flex-col gap-2 mt-3">
              {users.length === 0 ? (
                <p className="text-gray-400 text-center">
                  Tidak ada user untuk diikuti
                </p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-row gap-1 items-center"
                  >
                    <Image
                      alt="profile"
                      src="/profile.png"
                      width={100}
                      height={100}
                      className="w-10 h-10 rounded-full"
                    />
                    <h1>{user.username}</h1>
                    <div className="w-full flex justify-end">
                      <button
                        className={`cursor-pointer border py-1 px-4 rounded-md ${
                          user.is_followed
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}
                        onClick={() =>
                          handleFollowToggle(user.id, user.is_followed)
                        }
                      >
                        {user.is_followed ? 'Unfollow' : 'Follow'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <RefreshProvider>
      <LayoutContent>{children}</LayoutContent>
    </RefreshProvider>
  );
}
