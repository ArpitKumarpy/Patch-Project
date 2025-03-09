// frontend/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, fetchCurrentUser } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for saved token in localStorage
    const savedToken = localStorage.getItem('token')
    
    if (savedToken) {
      setToken(savedToken)
      fetchCurrentUser(savedToken)
        .then(userData => {
          setUser(userData)
        })
        .catch(error => {
          console.error('Failed to fetch user data:', error)
          localStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    
    try {
      const data = await loginUser(email, password)
      setToken(data.access_token)
      localStorage.setItem('token', data.access_token)
      
      const userData = await fetchCurrentUser(data.access_token)
      setUser(userData)
      
      return userData
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    
    try {
      return await registerUser(userData)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

// frontend/services/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Authentication Endpoints
export async function loginUser(email, password) {
  const formData = new URLSearchParams()
  formData.append('username', email) // OAuth2 expects username but we use email
  formData.append('password', password)

  const response = await fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userData.email,
      username: userData.username,
      password: userData.password,
      full_name: userData.fullName || '',
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Registration failed')
  }

  return response.json()
}

export async function fetchCurrentUser(token) {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }

  return response.json()
}

// Project Endpoints
export async function fetchProjects(token) {
  const response = await fetch(`${API_URL}/projects/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  return response.json()
}

export async function fetchProjectById(id, token) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch project')
  }

  return response.json()
}

export async function createProject(projectData, token) {
  const response = await fetch(`${API_URL}/projects/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to create project')
  }

  return response.json()
}

// Post Endpoints
export async function fetchPostsByProject(projectId, token) {
  const response = await fetch(`${API_URL}/posts/?project_id=${projectId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  return response.json()
}

export async function createPost(formData, token) {
  const response = await fetch(`${API_URL}/posts/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to create post')
  }

  return response.json()
}