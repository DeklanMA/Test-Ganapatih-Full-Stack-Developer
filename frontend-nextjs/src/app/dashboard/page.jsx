'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../lib/apiService';
import { useRefresh } from '../lib/useContext';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState('desc');
  const router = useRouter();
  const { refreshKey } = useRefresh();


  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const MIN_LOAD_MS = 500;


  const loadFeed = async (pageNum = 1, order = sort) => {
    const start = Date.now();
    try {
      setLoadingFeed(true);

      // panggilan utama
      const doFetch = async () => {
        const res = await apiService.getFeed(pageNum, limit, order);
        setPosts(res.posts || []);
        setHasMore((res.posts || []).length === limit);
      };

      try {
        await doFetch();
      } catch (err) {
        if (err?.response?.status === 401) {
          try {
            await apiService.refreshToken();
            await doFetch();
          } catch {

            localStorage.clear();
            router.push('/');
            return;
          }
        } else {
          throw err;
        }
      }
    } catch (err) {
      setError('Tidak bisa memuat feed');
      console.error('loadFeed error:', err);
    } finally {
      const elapsed = Date.now() - start;
      const remain = Math.max(0, MIN_LOAD_MS - elapsed);
      await sleep(remain); // <-- delay minimal 3 detik
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      localStorage.clear();
      router.push('/');
      return;
    }
    loadFeed(page, sort);
  }, [router, page, sort, refreshKey]);

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      setLoading(true);
      await apiService.createPost(content);
      setContent('');
      await loadFeed(page, sort);
    } catch {
      alert('Gagal membuat post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full mb-10">
      <div className="sticky top-0 w-full border border-gray-500 border-t-0 flex justify-center h-14 items-center bg-transparent backdrop-blur">
        <div>Mengikuti</div>
      </div>

      <div className="flex flex-col border border-gray-500 border-t-0 w-full h-fit">
        <div className="flex flex-row gap-6 my-auto items-start h-full mx-7 mt-10">
          <Image
            src="/profile.png"
            width={100}
            height={100}
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col w-full">
            <textarea
              value={content}
              onInput={(e) => setContent(e.target.value)}
              maxLength={200}
              className="bg-transparent w-full focus:outline-none focus:ring-0 text-xl resize-none overflow-hidden"
              placeholder="Apa yang sedang terjadi?"
              rows={1}
            />
            {content.length > 0 && (
              <div className="flex justify-between text-sm">
                <span
                  className={
                    content.length >= 200 ? 'text-red-500' : 'text-gray-500'
                  }
                >
                  {content.length}/200
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mx-9 mb-2">
          <button
            onClick={handlePost}
            disabled={loading || !content.trim()}
            className="cursor-pointer border py-2 px-8 rounded-md disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Posting'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 border border-gray-500 border-t-0 w-full">
        <h1 className="font-bold text-xl border-b border-gray-500 h-10 flex items-center justify-center">
          Filter Berita
        </h1>
        <div className="grid grid-cols-2 justify-center text-center">
          <p
            onClick={() => setSort('desc')}
            className={`border-r border-gray-500 h-full py-2 cursor-pointer ${
              sort === 'desc' ? 'bg-gray-700 text-white' : ''
            }`}
          >
            Berita Terbaru
          </p>
          <p
            onClick={() => setSort('asc')}
            className={`border-l border-gray-500 h-full py-2 cursor-pointer ${
              sort === 'asc' ? 'bg-gray-700 text-white' : ''
            }`}
          >
            Berita Lama
          </p>
        </div>
      </div>

      <div>
        <div>
          {loadingFeed ? (
            <div
              role="status"
              className="flex justify-center items-center w-full mt-10"
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : error ? (
            <p className="text-red-500 flex justify-center items-center h-96">
              {error}
            </p>
          ) : posts.length === 0 ? (
            <p className="text-gray-400 flex justify-center items-center h-96">
              Belum ada post
            </p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id || Math.random()}
                className="flex flex-row gap-1 border border-gray-500 border-t-0 w-full py-10"
              >
                <div className="flex items-start w-fit h-full ml-7 mr-3">
                  <Image
                    src="/profile.png"
                    width={100}
                    height={100}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <h1 className="font-bold">{post.username || 'User'}</h1>
                  <p className="break-words max-w-[600px] whitespace-pre-line">
                    {post.content || '(kosong)'}
                  </p>
                  <div className="flex justify-end w-full">
                    <p className="text-end text-sm text-gray-400">
                      {post.created_at
                        ? new Date(post.created_at).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })
                        : '...loading'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {posts.length > 0 && (
          <div className="flex justify-center gap-4 my-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer"
            >
              Sebelumnya
            </button>
            <span className="px-4 py-2">Halaman {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!hasMore}
              className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer"
            >
              Berikutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
