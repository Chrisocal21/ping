// Simple authentication for testing purposes

export interface User {
  username: string
}

const TEST_CREDENTIALS = {
  username: 'admin',
  password: 'adminp123'
}

export function login(username: string, password: string): User | null {
  if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
    const user = { username }
    if (typeof window !== 'undefined') {
      localStorage.setItem('ping_user', JSON.stringify(user))
    }
    return user
  }
  return null
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ping_user')
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('ping_user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }
  return null
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
