"use client"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
  lastLogin?: string
}

export type UserRole = "super_admin" | "admin" | "editor" | "viewer"

export interface Permission {
  action: string
  resource: string
}

export const ROLES: Record<UserRole, { name: string; permissions: Permission[]; color: string }> = {
  super_admin: {
    name: "Super Admin",
    color: "red",
    permissions: [
      { action: "create", resource: "team_member" },
      { action: "read", resource: "team_member" },
      { action: "update", resource: "team_member" },
      { action: "delete", resource: "team_member" },
      { action: "create", resource: "user" },
      { action: "read", resource: "user" },
      { action: "update", resource: "user" },
      { action: "delete", resource: "user" },
      { action: "manage", resource: "roles" },
      { action: "export", resource: "data" },
      { action: "import", resource: "data" },
      { action: "backup", resource: "system" },
    ],
  },
  admin: {
    name: "Admin",
    color: "blue",
    permissions: [
      { action: "create", resource: "team_member" },
      { action: "read", resource: "team_member" },
      { action: "update", resource: "team_member" },
      { action: "delete", resource: "team_member" },
      { action: "create", resource: "user" },
      { action: "read", resource: "user" },
      { action: "update", resource: "user" },
      { action: "export", resource: "data" },
      { action: "import", resource: "data" },
    ],
  },
  editor: {
    name: "Editor",
    color: "green",
    permissions: [
      { action: "create", resource: "team_member" },
      { action: "read", resource: "team_member" },
      { action: "update", resource: "team_member" },
      { action: "export", resource: "data" },
    ],
  },
  viewer: {
    name: "Viewer",
    color: "gray",
    permissions: [{ action: "read", resource: "team_member" }],
  },
}

export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  constructor() {
    this.loadCurrentUser()
  }

  private loadCurrentUser() {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      this.currentUser = JSON.parse(userData)
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        const users = this.getUsers()
        const user = users.find((u) => u.email === email)

        if (user && password === "demo123") {
          // Simple demo password
          this.currentUser = {
            ...user,
            lastLogin: new Date().toISOString(),
          }
          localStorage.setItem("currentUser", JSON.stringify(this.currentUser))
          this.updateUser(this.currentUser)
          resolve(this.currentUser)
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 1000)
    })
  }

  logout() {
    this.currentUser = null
    localStorage.removeItem("currentUser")
  }

  hasPermission(action: string, resource: string): boolean {
    if (!this.currentUser) return false

    const rolePermissions = ROLES[this.currentUser.role].permissions
    return rolePermissions.some((p) => p.action === action && p.resource === resource)
  }

  canManageUsers(): boolean {
    return this.hasPermission("create", "user") || this.hasPermission("manage", "roles")
  }

  getUsers(): User[] {
    const users = localStorage.getItem("users")
    if (users) {
      return JSON.parse(users)
    }

    // Default users for demo
    const defaultUsers: User[] = [
      {
        id: "1",
        email: "admin@company.com",
        name: "Super Admin",
        role: "super_admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        email: "manager@company.com",
        name: "Team Manager",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        email: "editor@company.com",
        name: "Content Editor",
        role: "editor",
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        email: "viewer@company.com",
        name: "Team Viewer",
        role: "viewer",
        createdAt: new Date().toISOString(),
      },
    ]

    localStorage.setItem("users", JSON.stringify(defaultUsers))
    return defaultUsers
  }

  createUser(userData: Omit<User, "id" | "createdAt">): User {
    const users = this.getUsers()
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
    return newUser
  }

  updateUser(userData: User): User {
    const users = this.getUsers()
    const index = users.findIndex((u) => u.id === userData.id)

    if (index !== -1) {
      users[index] = userData
      localStorage.setItem("users", JSON.stringify(users))
    }

    return userData
  }

  deleteUser(userId: string): boolean {
    const users = this.getUsers()
    const filteredUsers = users.filter((u) => u.id !== userId)

    if (filteredUsers.length !== users.length) {
      localStorage.setItem("users", JSON.stringify(filteredUsers))
      return true
    }

    return false
  }
}
