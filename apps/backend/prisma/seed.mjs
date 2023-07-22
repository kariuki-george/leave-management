import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

(async () => {
  // Create leavetypes
  const data = await prismaClient.leaveTypes.createMany({
    data: [
      {
        code: 'PL',
        name: 'Priviledge Leave',
      },
      { code: 'UP', name: 'Unpaid Leave' },
      {
        code: 'SL',
        name: 'Sick Leave',
      },
      { name: 'Casual Leave', code: 'CL' },
      {
        code: 'ML',
        name: 'Maternity Leave',
      },
      {
        code: 'PTL',
        name: 'Paternity Leave',
      },
    ],
  });

  console.log(data, 'leave types');
})();
