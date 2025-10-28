/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import type PaginationResponse from "../model/PaginationResponse";
import { AxiosError, type AxiosRequestConfig } from "axios";

type ApiService<T extends object> = {
    findAll: (config?: AxiosRequestConfig) => Promise<PaginationResponse<T>>;
    findById: (id: number) => Promise<T>;
    create: (payload: T) => Promise<T>;
    update: (id: number, payload: Partial<T>) => Promise<T>;
    delete: (id: number) => Promise<void>;
};

export function useApiService<T extends object>(service: ApiService<T>) {
    const [list, setList] = useState<T[]>([]);
    const [item, setItem] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState(false);

    const [params, setParams] = useState<Record<string, any>>({
        page: 0,
        size: 5,
    });
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0);

    const handleAsync = async <R>(
        fn: () => Promise<R>,
        setLoadingState: React.Dispatch<React.SetStateAction<boolean>>,
        errorMsg: string
    ): Promise<R> => {
        setLoadingState(true);
        try {
            return await fn();
        } catch (err: unknown) {
            let msg = errorMsg;

            if (err && typeof err === "object" && "isAxiosError" in err && (err as AxiosError).isAxiosError) {
                const axiosError = err as AxiosError;
                const status = axiosError.response?.status;
                const data = axiosError.response?.data as any;
                const serverMsg = data?.message;

                switch (status) {
                    case 401: msg = "No autorizado (401)"; break;
                    case 403: msg = "Prohibido (403)"; break;
                    case 500: msg = "Error interno del servidor (500)"; break;
                    default: if (serverMsg) msg = serverMsg;
                }
            } else if (err instanceof Error) {
                msg = err.message || msg;
            }

            alert(msg);
            throw err;
        } finally {
            setLoadingState(false);
        }
    };


    const getAll = useCallback(
        async (config?: AxiosRequestConfig) =>
            handleAsync(async () => {
                const res = await service.findAll({ params, ...config });
                setList(res.content);
                setTotal(res.totalPages * res.pageSize);
                setPages(res.totalPages);

                return res;
            }, setLoading, "Error al obtener los datos"),
        [service, params]
    );

    const getById = useCallback(
        (id: number) =>
            handleAsync(async () => {
                const res = await service.findById(id);
                setItem(res);
                return res;
            }, setLoadingItem, "Error al obtener el item"),
        [service]
    );


    const create = useCallback(
        async (payload: T) => handleAsync(async () => {
            const res = await service.create(payload);
            await getAll(); // refresca la lista después de crear
            return res;
        }, setLoading, "Error al crear el item"),
        [service, getAll]
    );

    const update = useCallback(
        async (id: number, payload: Partial<T>) => handleAsync(async () => {
            const res = await service.update(id, payload);
            await getAll();
            return res;
        }, setLoading, "Error al actualizar el item"),
        [service, getAll]
    );

    const remove = useCallback(
        async (id: number) => handleAsync(async () => {
            await service.delete(id);
            await getAll();
        }, setLoading, "Error al eliminar el item"),
        [service, getAll]
    );

    const setPage = useCallback((page: number) => {
        setParams(prev => prev.page !== page ? { ...prev, page } : prev);
    }, []);

    const setPageSize = useCallback((size: number) => {
        setParams(prev => prev.size !== size ? { ...prev, size, page: 0 } : prev);
    }, []);

    const setFilter = useCallback((key: string, value: any) => {
        setParams(prev => prev[key] !== value ? { ...prev, [key]: value, page: 0 } : prev);
    }, []);

    useEffect(() => {
        getAll();
    }, [getAll]);

    return {
        list,
        item,
        loading,
        loadingItem,
        params,
        total,
        setPage,
        setPageSize,
        setFilter,
        getAll,
        getById,
        create,
        update,
        remove,
        pages,
        setPages,
    };
}
