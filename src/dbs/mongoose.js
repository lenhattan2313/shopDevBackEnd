const { default: mongoose } = require("mongoose");
const { checkConnect } = require("../helpers");
const DB_URL = `mongodb://127.0.0.1:27017/shopDev`;

//singleton pattern

class MongoDB {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(DB_URL, { maxPoolSize: 100 })
      .then(() => {
        console.log(`Connect Mongo DB`);
        console.log(`Connection counts: ${checkConnect()}`);
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
