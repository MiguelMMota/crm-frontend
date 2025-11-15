/**
 * API client for backend communication
 */
import axios, { AxiosInstance, AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = this.getToken()
      if (token) {
        config.headers.Authorization = `Token ${token}`
      }
      return config
    })

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  private clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Auth endpoints
  async login(username: string, password: string) {
    const response = await this.client.post('/auth/users/login/', {
      username,
      password,
    })
    this.setToken(response.data.token)
    return response.data
  }

  async register(data: { username: string; email: string; password: string; password_confirm: string }) {
    const response = await this.client.post('/auth/users/register/', data)
    this.setToken(response.data.token)
    return response.data
  }

  async logout() {
    await this.client.post('/auth/users/logout/')
    this.clearToken()
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/users/me/')
    return response.data
  }

  // Relationships endpoints
  async getRelationships(params?: Record<string, any>) {
    const response = await this.client.get('/relationships/', { params })
    return response.data
  }

  async getRelationship(id: number) {
    const response = await this.client.get(`/relationships/${id}/`)
    return response.data
  }

  async createRelationship(data: any) {
    const response = await this.client.post('/relationships/', data)
    return response.data
  }

  async updateRelationship(id: number, data: any) {
    const response = await this.client.put(`/relationships/${id}/`, data)
    return response.data
  }

  async deleteRelationship(id: number) {
    await this.client.delete(`/relationships/${id}/`)
  }

  // Interactions endpoints
  async getInteractions(params?: Record<string, any>) {
    const response = await this.client.get('/interactions/', { params })
    return response.data
  }

  async getInteraction(id: number) {
    const response = await this.client.get(`/interactions/${id}/`)
    return response.data
  }

  async createInteraction(data: any) {
    const response = await this.client.post('/interactions/', data)
    return response.data
  }

  // Notes endpoints
  async getNotes(params?: Record<string, any>) {
    const response = await this.client.get('/notes/', { params })
    return response.data
  }

  async updateNote(id: number, data: any) {
    const response = await this.client.put(`/notes/${id}/`, data)
    return response.data
  }
}

export const api = new APIClient()
