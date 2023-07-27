import React from 'react';

import { ForgotPassForm } from './components/form';

const ForgotPassword = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-2">
      <section className="flex w-full  flex-col items-center justify-between gap-3 pt-10">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <ForgotPassForm />
      </section>

      <span className="  mt-4">
        An email with a change password link will be sent to this email
      </span>
    </div>
  );
};

export default ForgotPassword;
