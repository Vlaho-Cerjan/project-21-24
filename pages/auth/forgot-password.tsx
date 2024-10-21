import { useSession } from 'next-auth/react';
import React from 'react';
import ForgotPasswordComponent from '../../src/components/auth/forgotPasswordComponent';
import AuthLayout from '../../src/components/authLayout/authLayout';

const ForgotPassword = () => {
    const session = useSession();

    React.useEffect(() => {
      if(session.status === "authenticated") {
        window.location.href = "/";
      }
    }, [session]);

    return (
        <AuthLayout>
            <ForgotPasswordComponent />
        </AuthLayout>
    )
}

export default ForgotPassword;