import { useEffect, useState } from "react";
import { User } from "../../../shard/src";

export const useUser=()=>{
    const [user,setUser]=useState({} as any)
    const [userLoaded,setUserLoaded]=useState(false)
    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
          const userData = JSON.parse(stored);
          setUser(userData);
        }
        setUserLoaded(true);
      }, []);

      return{
        user,userLoaded
      }
}