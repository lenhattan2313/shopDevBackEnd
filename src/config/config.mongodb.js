"use strict";

const dev = {
  app: {
    port: process.env.PORT_DEV || 3000,
  },
  db: {
    host: process.env.HOST_DEV || "127.0.0.1",
    port: process.env.PORT_DB_DEV || 27017,
    name: process.env.DB_NAME_DEV || "shopDev",
  },
};
const pro = {
  app: {
    port: process.env.PORT_PRO || 3000,
  },
  db: {
    host: process.env.HOST_PRO || "192.168.0.1",
    port: process.env.PORT_DB_PRO || 27017,
    name: process.env.DB_NAME_PRO || "shopPro",
  },
};
const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
