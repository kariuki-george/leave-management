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
    year: '/year',
    dashboard: '/dashboard',
    reports: '/reports',
    admin: '/admin',
    home: '/',
  },
};
