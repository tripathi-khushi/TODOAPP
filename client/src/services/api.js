/**
 * API Service for Smartech Todo Application
 * Handles authenticated communication with Express backend REST endpoints and OTP services.
 */

const getAuthHeaders = () => {
  const token = localStorage.getItem('smartech_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // ==================== AUTH & OTP APIS ====================

  /**
   * Step 1: Send 6-digit OTP code to email for signup verification
   */
  async sendSignupOtp(userData) {
    const res = await fetch('/api/auth/send-signup-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to send verification code');
    }
    return data;
  },

  /**
   * Step 2: Verify 6-digit OTP and complete account creation
   */
  async verifySignupOtp(email, otp) {
    const res = await fetch('/api/auth/verify-signup-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Invalid or expired verification code');
    }
    if (data.token) {
      localStorage.setItem('smartech_token', data.token);
    }
    return data;
  },

  /**
   * Resend fresh 6-digit OTP
   */
  async resendOtp(email) {
    const res = await fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to resend code');
    }
    return data;
  },

  /**
   * Log in an existing user
   */
  async login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    if (data.token) {
      localStorage.setItem('smartech_token', data.token);
    }
    return data;
  },

  /**
   * Fetch current authenticated user from MongoDB
   */
  async getMe() {
    const token = localStorage.getItem('smartech_token');
    if (!token) return { success: true, user: null, isLoggedIn: false };

    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      localStorage.removeItem('smartech_token');
      return { success: true, user: null, isLoggedIn: false };
    }
    return res.json();
  },

  /**
   * Update current user profile in MongoDB
   */
  async updateProfile(profileData) {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data;
  },

  // ==================== TODOS CRUD APIS ====================

  /**
   * Fetch todos from database
   */
  async getTodos(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });

    const url = `/api/todos${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch todos: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetch single todo by ID
   */
  async getTodoById(id) {
    if (!id) throw new Error('Todo ID is required');
    const res = await fetch(`/api/todos/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Todo not found with ID ${id}`);
    }
    return res.json();
  },

  /**
   * Create a new todo in database
   */
  async createTodo(todoData) {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(todoData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create todo');
    }
    return res.json();
  },

  /**
   * Update an existing todo in database
   */
  async updateTodo(id, todoData) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(todoData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update todo');
    }
    return res.json();
  },

  /**
   * Partial update
   */
  async patchTodo(id, patchData) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(patchData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to patch todo status');
    }
    return res.json();
  },

  /**
   * Delete a todo from database
   */
  async deleteTodo(id) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete todo');
    }
    return res.json();
  },

  /**
   * Fetch aggregated statistics computed dynamically from database
   */
  async getStats() {
    const res = await fetch('/api/todos/stats', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch statistics');
    }
    return res.json();
  },
};
