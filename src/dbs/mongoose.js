const { default: mongoose } = require("mongoose");
const { checkConnect } = require("../helpers/check.connect");
const {
  db: { host, name, port },
} = require("../config/config.mongodb");
const DB_URL = `mongodb://${host}:${port}/${name}`;

//singleton pattern

class MongoDB {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(DB_URL, { maxPoolSize: 100 })
      .then(() => {
        console.log(`Connected Mongo DB: ${checkConnect()}`);
        if (1 === 1) {
          mongoose.set("debug", true);
          mongoose.set("debug", { color: true });
        }
      })
      .catch((error) => console.log("Error connect MongoDB ", error));
  }

  static getInstance() {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }
}

const mongodb = MongoDB.getInstance();

module.exports = mongodb;
