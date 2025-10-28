import type User from "./User"

export default interface ContextType {
    user: User | null
    login: (username: string, password: string) => Promise<User | null>
    signup: (payload: User) => Promise<User | null>
    logout: () => void
    loading: boolean
}