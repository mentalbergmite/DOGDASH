// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Replace with your Flask server URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const signup = async (userData) => {
  try {
    const response = await api.post('/api/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (userData) => {
  try {
    const response = await api.post('/api/login', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
