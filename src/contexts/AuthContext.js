import React, { useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
     let unsubscribe;
     unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log("CU ", currentUser);
         setLoading(false)
         if(currentUser) setUser(currentUser)
         else{setUser(null)}
     });
     return () => {
         if(unsubscribe) unsubscribe();
     }
  },[])

  const value = {
    user: user,
    setUser: setUser
 }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
