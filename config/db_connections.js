require('dotenv').config({path:'../.env'})
const knex = require("knex")({
    client: "mysql",
    connection: {
        host: "localhost",
        user: "root",
        password: process.env.PASSWORD || "Mahendra@1",
        database: "blogApp",
    },
});

// user data
knex.schema
    .createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name");
        table.string("email").unique();
        table.string("password");
    })
    .then(() => {
        console.log("Table Create succesfully");
    })
    .catch((err) => {
        // console.log(err.message);
    });

// blog data
knex.schema
    .createTable("blogData", (table) => {
        table.increments("id");
        table.integer('blogerID').unsigned().nullable()
        table.string("title");
        table.text("content");
        table.foreign('blogerID').references('users.id')
        table.timestamp("posted_at").defaultTo(knex.fn.now());
    })
    .then(() => {
        console.log("Table Create succesfully");
    })
    .catch((err) => {
        // console.log(err.message);
    });

// likes data


// comments data

module.exports = knex;
