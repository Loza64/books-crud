import { Routes } from '@generouted/react-router/lazy'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <Routes />
    </>
  )
}

export default App
