import { useState, useCallback } from 'react'
import { message } from 'antd'

type ApiService<T extends object> = {
    findAll: () => Promise<T[]>
    findById: (id: number) => Promise<T>
    create: (payload: T) => Promise<T>
    update: (id: number, payload: Partial<T>) => Promise<T>
    delete: (id: number) => Promise<void>
}

export function useApiService<T extends object>(service: ApiService<T>) {
    const [data, setData] = useState<T[] | null>(null)
    const [item, setItem] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [loadingItem, setLoadingItem] = useState(false)

    const handleAsync = async <R>(
        fn: () => Promise<R>,
        setLoadingState: React.Dispatch<React.SetStateAction<boolean>>,
        errorMsg: string
    ): Promise<R> => {
        setLoadingState(true)
        try {
            return await fn()
        } catch (err: unknown) {
            const error = err as Error
            message.error(error.message || errorMsg)
            throw error
        } finally {
            setLoadingState(false)
        }
    }

    const getAll = useCallback(() => handleAsync(
        async () => {
            const res = await service.findAll()
            setData(res)
            return res
        },
        setLoading,
        'Error al obtener los datos'
    ), [service])

    const getById = useCallback((id: number) => handleAsync(
        async () => {
            const res = await service.findById(id)
            setItem(res)
            return res
        },
        setLoadingItem,
        'Error al obtener el item'
    ), [service])

    const create = useCallback((payload: T) => handleAsync(
        async () => {
            const res = await service.create(payload)
            await getAll()
            return res
        },
        setLoading,
        'Error al crear el item'
    ), [service, getAll])

    const update = useCallback((id: number, payload: Partial<T>) => handleAsync(
        async () => {
            const res = await service.update(id, payload)
            await getAll()
            return res
        },
        setLoading,
        'Error al actualizar el item'
    ), [service, getAll])

    const remove = useCallback((id: number) => handleAsync(
        async () => {
            await service.delete(id)
            await getAll()
        },
        setLoading,
        'Error al eliminar el item'
    ), [service, getAll])

    return { data, item, loading, loadingItem, getAll, getById, create, update, remove }
}
