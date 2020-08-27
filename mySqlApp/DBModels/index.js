"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);

module.exports = (Config, logger) => {
  // function am_base64_convert(string) {
  //   return Buffer.from(string, "base64").toString("ascii");
  // }

  let sequelize = new Sequelize(
    Config.dbConfig.dbName,
    Config.dbConfig.dbUser,
    Config.dbConfig.dbPass,
    {
      query: { raw: true },
      host: Config.dbConfig.dbHost,
      port: Config.dbConfig.dbPort,
      dialect: Config.dbConfig.dbType.toLowerCase() || "mysql",
      logging: function(message) {
        logger.debug("sequelize_debug sql : " + message);
      },
      dialectOptions: {
        //it must be true for Azure
        encrypt: true,
        requestTimeout: 30000
      },
      pool: Config.dbConfig.pool,
      define: {
        freezeTableName: true,
        paranoid: false, // nice feature if enabled. nothing is deleted.
        charset: "utf8",
        timestamps: true,
        createdAt: "CREATED_AT",
        updatedAt: "UPDATED_AT",
        deletedAt: "DELETED_AT" // Used when paranoid is set to false.
      }
    }
  );

  let db = {};

  fs.readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    })
    .forEach(file => {
      let model = sequelize["import"](path.join(__dirname, file));
      //TODO. Here is a tricky solution to get the model name, not the table name.
      db[file.slice(0, file.length - 3)] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;

  return db;
};
