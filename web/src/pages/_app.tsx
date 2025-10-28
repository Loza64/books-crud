import ContextProvider from "../Context/ContextProvider";
import PanelView from "../views/PanelView";

export default function Pages() {
    return (
        <ContextProvider>
            <PanelView />
        </ContextProvider>
    )
}