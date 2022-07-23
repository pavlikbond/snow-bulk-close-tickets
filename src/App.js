import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";
import "./index.css";
import "./styles.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import BulkCloser from "./components/BulkCloser";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="bulk-close-app" element={<BulkCloser />} />
            </Routes>
        </>
    );
}

export default App;
