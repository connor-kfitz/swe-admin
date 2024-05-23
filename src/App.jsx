import AuthProvider from "./contexts/AuthContext";
import AuthGuard from "./guards/AuthGuard";
import SignIn from "./pages/Login";
import Products from "./pages/Products";
import Articles from "./pages/Articles";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
    <Router>
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<AuthGuard><Navigate to="/products"/></AuthGuard>}/>
          <Route path="/products" element={<AuthGuard><Products/></AuthGuard>}/>
          <Route path="/articles" element={<AuthGuard><Articles/></AuthGuard>}/>
          <Route path="/login" element={<SignIn/>}/>
        </Routes>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;
