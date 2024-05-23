import React, { useContext, useEffect, useState } from 'react'
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider() {
  const [currentUser, setCurrentUser] = useState();

  function signUp(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    })
  }, [])

  const value = {
    currentUser,
    signUp
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
