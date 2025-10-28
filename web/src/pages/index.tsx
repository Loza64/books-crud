import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PanelView from "../views/PanelView"

export default function RouterPanel() {
    const navigate = useNavigate()
    useEffect(() => {
        navigate("/dashboard")
    }, [navigate])
    return <PanelView />
}