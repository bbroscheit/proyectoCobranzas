import { useState, useEffect } from "react";
import { useRouter } from "next/router";

function useUser() {
  //console.log("useUser hook initialized");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userLogin = localStorage.getItem("userCobranzas");
    if (userLogin) {
      try {
        setUser(JSON.parse(userLogin));
        //console.log("User data set from localStorage:", JSON.parse(userLogin));
      } catch (error) {
        setUser(null);
        router.push("/");
      }
    } else {
      router.replace("/");
    }
  }, [router]);

  return [user, setUser];
}

export default useUser;