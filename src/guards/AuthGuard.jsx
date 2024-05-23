import { Navigate } from "react-router-dom"

export default function AuthGuard({ children, user }) {
  return user ? children : <Navigate to={"/login"}/>
}
