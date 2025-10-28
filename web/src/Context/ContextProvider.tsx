/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback, useContext, useEffect } from "react"
import type User from "../model/User"
import type ContextType from "../model/ContextType"
import { AuthService } from "../service/AuthSservice"
import { removeToken, getToken } from "../utlis/token"
import { message } from "antd"
import { useNavigate, useLocation } from "react-router-dom"

const Context = createContext<ContextType | undefined>(undefined)
const service = AuthService.getInstance()

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [messageApi, contextHolder] = message.useMessage()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const navigate = useNavigate()
    const location = useLocation()

    // Función para manejar login
    const login = useCallback(
        async (username: string, password: string) => {
            try {
                const result = await service.login(username, password)
                if (result) {
                    setUser(result)
                    messageApi.success(`Bienvenido, ${result.username || "usuario"} 👋`)
                    navigate("/", { replace: true })
                }
                return result
            } catch (error) {
                console.error("Error en login:", error)
                messageApi.error("Error al iniciar sesión. Verifica tus credenciales.")
                return null
            }
        },
        []
    )

    const signup = useCallback(
        async (payload: User) => {
            try {
                const result = await service.signUp(payload)
                if (result) {
                    setUser(result)
                    messageApi.success("Registro exitoso 🎉")
                    navigate("/", { replace: true })
                }
                return result
            } catch (error) {
                console.error("Error en signup:", error)
                messageApi.error("Error al registrarse. Inténtalo de nuevo.")
                return null
            }
        },
        [navigate]
    )

    const logout = useCallback(() => {
        removeToken()
        setUser(null)
        messageApi.info("Sesión cerrada correctamente.")
        if (location.pathname !== "/login") navigate("/login", { replace: true })
    }, [navigate, location.pathname])

    const profile = useCallback(async () => {
        try {
            const response = await service.profile()
            if (response) {
                setUser(response)
            } else {
                throw new Error("Perfil inválido")
            }
        } catch (error) {
            console.warn("Error cargando perfil:", error)
            setUser(null)
            removeToken()
            if (location.pathname !== "/login") navigate("/login", { replace: true })
        }
    }, [navigate, location.pathname])

    // Efecto inicial para verificar token y cargar perfil
    useEffect(() => {
        const token = getToken()
        if (token) {
            profile().finally(() => setLoading(false))
        } else {
            setLoading(false)
            if (location.pathname !== "/login") navigate("/login", { replace: true })
        }
    }, [profile, location.pathname, navigate])

    const value: ContextType = { user, login, signup, logout, loading }

    // Mostrar pantalla de carga mientras verifica sesión
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
                Cargando sesión...
            </div>
        )
    }

    return (
        <Context.Provider value={value}>
            {children}
            {contextHolder}
        </Context.Provider>
    )
}

// Hook para consumir el contexto de autenticación
export const useContextProvider = (): ContextType => {
    const context = useContext(Context)
    if (!context) throw new Error("El contexto de autenticación no ha sido inicializado")
    return context
}
