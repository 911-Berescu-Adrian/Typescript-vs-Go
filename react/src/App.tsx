import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CdList from "./pages/CdList";
import AddCd from "./pages/AddCd";
import CdDetails from "./pages/CdDetails";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<CdList />} />
                    <Route path="/add" element={<AddCd />} />
                    <Route path="/details/:id" element={<CdDetails />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
