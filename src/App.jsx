import AuthProvider from "./contexts/AuthContext";
import SignIn from "./pages/SignIn";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
    <Router>
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<Navigate to="/products"/>}/>
          <Route path="/signup" element={<SignIn/>}/>
        </Routes>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;
