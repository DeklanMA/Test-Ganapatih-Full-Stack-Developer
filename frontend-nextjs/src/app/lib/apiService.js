import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

function toForm(data) {
  const form = new URLSearchParams();
  for (const key in data) {
    form.append(key, data[key]);
  }
  return form;
}

const apiService = {
  register: async (username, password) => {
    const res = await api.post(
      '/register',
      toForm({ Username: username, Password: password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return res.data;
  },

  login: async (username, password) => {
    const res = await api.post(
      '/login',
      toForm({ Username: username, Password: password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, refresh_token } = res.data;

    localStorage.setItem('username', username);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    return res.data;
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token');

    const res = await api.post('/refresh', toForm({ refresh_token: refresh }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = res.data;
    localStorage.setItem('access_token', access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    return res.data;
  },

  createPost: async (content) => {
    const token = localStorage.getItem('access_token');
    const res = await api.post('/posts', toForm({ content }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  getFeed: async (page = 1, limit = 10, order = 'desc') => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await api.get(
        `/feed?page=${page}&limit=${limit}&order=${order}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Feed data:', res.data);
      return res.data;
    } catch (err) {
      console.error('Error getFeed:', err);
      throw err;
    }
  },

  getSuggestedUsers: async () => {
    const token = localStorage.getItem('access_token');
    const res = await api.get('/users/suggested', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  followUser: async (userId) => {
    const token = localStorage.getItem('access_token');
    const res = await api.post(`/follow/${userId}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  unfollowUser: async (userId) => {
    const token = localStorage.getItem('access_token');
    const res = await api.delete(`/follow/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  logout: async () => {
    const token = localStorage.getItem('access_token');
    await api.post(
      '/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    localStorage.clear();
  },
};

export default apiService;
