/**
 * API Service for Smartech Todo Application
 * Handles communication with Express backend REST endpoints.
 */

const API_BASE_URL = '/api/todos';

export const api = {
  /**
   * Fetch all todos with optional query filters
   * @param {Object} params - { search, status, category, priority, sortBy, order }
   */
  async getTodos(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });

    const url = `${API_BASE_URL}${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch todos: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetch a single todo by its ID
   * @param {string} id
   */
  async getTodoById(id) {
    if (!id) throw new Error('Todo ID is required');
    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Todo not found with ID ${id}`);
    }
    return res.json();
  },

  /**
   * Create a new todo
   * @param {Object} todoData
   */
  async createTodo(todoData) {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create todo');
    }
    return res.json();
  },

  /**
   * Update an existing todo (full update)
   * @param {string} id
   * @param {Object} todoData
   */
  async updateTodo(id, todoData) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update todo');
    }
    return res.json();
  },

  /**
   * Partial update (e.g. toggle complete status, add subtask)
   * @param {string} id
   * @param {Object} patchData
   */
  async patchTodo(id, patchData) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patchData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to patch todo status');
    }
    return res.json();
  },

  /**
   * Delete a todo by ID
   * @param {string} id
   */
  async deleteTodo(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete todo');
    }
    return res.json();
  },

  /**
   * Fetch aggregated statistics for gauges and summary cards
   */
  async getStats() {
    const res = await fetch(`${API_BASE_URL}/stats`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch statistics');
    }
    return res.json();
  },

  /**
   * Re-seed sample todos
   */
  async seedTodos() {
    const res = await fetch(`${API_BASE_URL}/seed`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to seed sample todos');
    }
    return res.json();
  },
};
