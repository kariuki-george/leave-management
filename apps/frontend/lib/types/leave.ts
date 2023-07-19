export type ILeave =
  | {
      code: 'PL';
      name: 'Priviledge Leave';
    }
  | { code: 'UP'; name: 'Unpaid Leave' }
  | {
      code: 'SL';
      name: 'Sick Leave';
    }
  | { name: 'Casual Leave'; code: 'CL' }
  | {
      code: 'ML';
      name: 'Maternity Leave';
    }
  | {
      code: 'PTL';
      name: 'Paternity Leave';
    };

export const leaves: ILeave[] = [
  { code: 'CL', name: 'Casual Leave' },
  { code: 'ML', name: 'Maternity Leave' },
  { code: 'PL', name: 'Priviledge Leave' },
  { code: 'PTL', name: 'Paternity Leave' },
  { code: 'SL', name: 'Sick Leave' },
  { code: 'UP', name: 'Unpaid Leave' },
];