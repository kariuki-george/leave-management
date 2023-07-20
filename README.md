# Leave Management system

A web application that automates the application and tracking of leaves.

## Types of Leaves

| Name             | Code |
| ---------------- | ---- |
| Priviledge Leave | PL   |
| Unpaid Leave     | UP   |
| Sick Leave       | SL   |
| Casual Leave     | CL   |
| Maternity Leave  | ML   |
| Paternity Leave  | PTL  |

## Types of Users

1. Admin - Can accept leaves
2. Users/ Employees

## Pages on the web application

1.  Dashboard - Shows stats specific to the user
2.  MyYear - Shows a full year calendar for the user with the days they went for a leave
3.  Reports - ADMIN ONLY - Can view stats for all users, leave types, etc
4.  Profile - Users can update they account details
5.  Login
6.  Register
7.  Forgot password
8.  Request password change
9.  Confirm account - Users will confirm their account after registration
10. Settings

## User story

A user creates an account on the application.

The user receives an email for account creation

The user logs into the application and lands on the dashboard.

The user can request a leave on the dashboard/ myyear pages and awaits approval.

The admin will receive all leave requests and accept or reject.

The user/ admin will receive any kind on notification via email\*

## Technologies

1. Nextjs → Frontend framework
2. Nestjs → Backend framework
3. Postgres → Database
4. Email → Provider to be added
