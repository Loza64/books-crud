import {
    LeftOutlined,
    LoadingOutlined,
    LogoutOutlined,
    RightOutlined,
} from '@ant-design/icons'
import {
    Avatar,
    Button,
    Layout,
    Menu,
    Spin,
    Tag,
    Tooltip,
    Typography,
} from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { FaBook } from 'react-icons/fa'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useContextProvider } from '../Context/ContextProvider'
import type User from '../model/User'
import type Role from '../model/Role'
import { ImBooks } from 'react-icons/im'

const { Sider } = Layout
const { Text } = Typography

const PanelView: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user: contextUser, logout, loading } = useContextProvider()!
    const [collapsed, setCollapsed] = useState(true)
    const [user, setUser] = useState<User>()
    const role = user?.role as Role | undefined

    const routesConfig = useMemo(
        () => [
            { key: '/dashboard', icon: <ImBooks />, label: 'Libros', name: 'Gestión de libros', section: 'Administración', view: true },
            { key: '/genders', icon: <FaBook />, label: 'Generos', name: 'Gestions de generos literarios', section: 'Administracion', view: true },
        ],
        []
    )

    const menuItems = useMemo(() => routesConfig.filter((item) => item.view), [routesConfig])

    useEffect(() => {
        if (contextUser) setUser(contextUser)
    }, [contextUser])

    const handleLogout = () => {
        logout()
    }

    const handleMenuClick = (key: string) => {
        if (key === 'toggle') return setCollapsed((prev) => !prev)
        navigate(key)
    }

    const pageInfo = useMemo(() => {
        const current = routesConfig.find((route) => route.key === location.pathname)
        return current ? { name: current.name, section: current.section } : { name: 'Dashboard' }
    }, [location.pathname, routesConfig])

    // Rutas públicas (login, etc.)
    if (location.pathname.startsWith('/login') || location.pathname.startsWith('/yupi')) {
        return <Outlet />
    }

    return (
        <Layout className="min-h-screen font-[Poppins] text-[14px]">
            {/* Botón de colapso */}
            <div
                className={`fixed top-4 z-500 transition-all duration-300 ease-out ${collapsed ? 'left-[95px]' : 'left-[265px]'
                    } -translate-x-full`}
            >
                <button
                    onClick={() => handleMenuClick('toggle')}
                    className="flex items-center justify-center rounded-full bg-white p-1.5 text-primary shadow-md transition-transform duration-150 hover:bg-gray-50 active:scale-95"
                >
                    {collapsed ? <RightOutlined className="text-[15px] font-bold" /> : <LeftOutlined className="text-[15px] font-bold" />}
                </button>
            </div>

            {/* Sider lateral */}
            <Sider
                collapsible
                collapsed={collapsed}
                theme="light"
                width={250}
                collapsedWidth={80}
                trigger={null}
                className="flex h-full flex-col bg-white shadow-sm transition-all duration-300"
            >
                {/* Avatar y nombre */}
                <div className={`flex items-center gap-3 p-4 transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}>
                    <Avatar size={48} className="bg-blue-100 font-semibold text-blue-600">
                        {loading ? <Spin indicator={<LoadingOutlined spin />} size="small" /> : (user?.username?.[0] ?? '?').toUpperCase()}
                    </Avatar>
                    {!collapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <Tooltip title={user?.username || 'Unknown'} placement="bottom">
                                <Text ellipsis strong className="text-sm font-medium leading-tight text-gray-800">
                                    {loading ? 'Cargando...' : user?.username ?? 'Unknown'}
                                </Text>
                            </Tooltip>
                            <Tag className="mt-1 w-fit text-xs" color={role ? 'green' : 'red'}>
                                {role?.name || 'unknown'}
                            </Tag>
                        </div>
                    )}
                </div>

                {/* Menú de navegación */}
                <div className="scrollbar-hide h-[calc(100dvh-136px)] overflow-y-auto px-1">
                    <Menu
                        mode="inline"
                        theme="light"
                        selectedKeys={[location.pathname]}
                        items={menuItems.map((route) => ({ key: route.key, icon: route.icon, label: route.label }))}
                        onClick={({ key }) => {
                            if (key !== location.pathname) navigate(key)
                        }}
                        inlineCollapsed={collapsed}
                        className="border-none font-bold"
                    />
                </div>

                {/* Logout */}
                <div className="p-3">
                    <Button
                        type="text"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        block
                        className="flex items-center justify-center gap-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
                    >
                        {!collapsed && 'Cerrar sesión'}
                    </Button>
                </div>
            </Sider>

            {/* Layout principal */}
            <Layout className="flex min-h-screen flex-col overflow-hidden bg-white transition-all duration-200 ease-in-out">
                {/* Header */}
                <div className="flex shrink-0 items-center gap-4 bg-white px-9 py-4">
                    <div className="flex flex-col text-primary">
                        <span className="text-sm font-medium">
                            {pageInfo.section && `${pageInfo.section} / `}
                            {pageInfo.name}
                        </span>
                        {pageInfo.name && <h2 className="text-[28px] font-bold leading-tight">{pageInfo.name}</h2>}
                    </div>
                </div>

                {/* Contenido */}
                <div className="scrollbar-hide h-[calc(100dvh-89px)] overflow-y-auto rounded-tl-lg bg-gray-100 p-3">
                    <Outlet />
                </div>
            </Layout>
        </Layout>
    )
}

export default PanelView
