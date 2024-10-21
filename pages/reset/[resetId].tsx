import { useSession } from 'next-auth/react';
import React from 'react';
import ResetPasswordComponent from '../../src/components/auth/resetPasswordComponent';
import AuthLayout from '../../src/components/authLayout/authLayout';

const ResetPassword = () => {
  const session = useSession();

  React.useEffect(() => {
    if(session.status === "authenticated") {
      window.location.href = "/";
    }
  }, [session]);

  return(
    <AuthLayout>
      <ResetPasswordComponent />
    </AuthLayout>
  )
}
export default ResetPassword;