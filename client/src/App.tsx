import { Route, Routes } from "react-router-dom"
import { Home, Layout, Login, Register } from "./pages"

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
            </Route>
        </Routes>
    )
}

export default App