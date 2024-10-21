import { useSession } from "next-auth/react";
import React from "react";
import LoginComponent from "../src/components/auth/loginComponent";
import AuthLayout from '../src/components/authLayout/authLayout';

export default function Login() {
  const session = useSession();

  React.useEffect(() => {
    if(session.status === "authenticated") {
      window.location.href = "/";
    }
  }, [session]);

  return (
    <AuthLayout>
      <LoginComponent />
    </AuthLayout>
  );
}