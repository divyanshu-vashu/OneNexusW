"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function withAuth(Component) {
  return function Protected(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login"); // redirect to login page
      } else {
        setLoading(false); // token exists, allow rendering
      }
    }, [router]);

    if (loading) {
      return <p className="p-4 text-center">Checking authentication...</p>;
    }

    return <Component {...props} />;
  };
}
