export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'LMS',
  description: 'Leave management system.',

  links: {
    twitter: 'https://twitter.com/_kariuki_george',
    github: 'https://github.com/kariuki-george/comms',
  },
  nav: {
    landing: '/landing',
    auth: {
      login: '/auth/login',
      register: '/auth/getstarted',
      forgotPass: '/auth/forgotpass',
    },

    dashboard: '/dashboard',

    admin: {
      users: '/admin/users',
      holidays: '/admin/holidays',
      leavetypes: '/admin/leavetypes',
      finyear: '/admin/finyear',
    },
    home: '/',
    leaves: {
      calendar: '/leaves/calendar',
      compare: '/leaves/compare',
      print: '/leaves/print',
      apply: '/leaves',
    },
  },
};
