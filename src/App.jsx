import AuthProvider from "./contexts/AuthContext";
import AuthGuard from "./guards/AuthGuard";
import SignIn from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import ArticlesPage from "./pages/ArticlesPage";
// import TestimonialsPage from "./pages/TestimonialsPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
    <Router>
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<AuthGuard><Navigate to="/products"/></AuthGuard>}/>
          <Route path="/products" element={<AuthGuard><ProductsPage/></AuthGuard>}/>
          <Route path="/articles" element={<AuthGuard><ArticlesPage/></AuthGuard>}/>
          {/* <Route path="/testimonials" element={<AuthGuard><TestimonialsPage/></AuthGuard>}/> */}
          <Route path="/login" element={<SignIn/>}/>
        </Routes>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;
