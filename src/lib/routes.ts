export const routes = [
  {
    name: "Result Management",
    links: [
      {
        name: "Class Rooms",
        badge: null,
        url: "/classes",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        name: "Students",
        badge: null,
        url: "/students",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"],
      },
      {
        name: "Subjects",
        badge: null,
        url: "/subjects",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        name: "Grade System",
        badge: null,
        url: "/grade",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"],
      },
    ],
  },

  {
    name: "User Management",
    links: [
      {
        name: "Users",
        badge: null,
        url: "/users",
        roles: ["SUPER_ADMIN","ADMIN"],
      },
    ],
  },
  {
    name: null,
    links: [
      {
        name: "Settings",
        badge: null,
        url: "/settings",
        roles: ["SUPER_ADMIN", "ADMIN", "USER"],
      },
    ],
  },
];
