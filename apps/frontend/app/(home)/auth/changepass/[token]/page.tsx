import React from 'react';

import { ChangePassForm } from './components/form';

const ChangePassword = ({ params }: { params: { token: string } }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-2">
      <section className="flex w-full  flex-col items-center justify-between gap-3 pt-10">
        <h1 className="text-2xl font-bold">Change password</h1>
        <ChangePassForm token={params.token} />
      </section>
    </div>
  );
};

export default ChangePassword;
