const knex = require("knex");
const jwt = require("jsonwebtoken");

const genToken = ({ id }) => {
    return jwt.sign(id, "ajsf#Fhu647%8%9gf%yuvcgjmcui*&t53hj");
};

const verToken = async (req, res, next) => {
    if (req.headers.cookie) {
        const token = (req.headers.cookie).split("=")[1];
        const id = jwt.verify(token, "ajsf#Fhu647%8%9gf%yuvcgjmcui*&t53hj");
        const user = await knex("users").where({ id });
        req.userData = user;
        next();
    } else {
        res.send("token expired");
    }
};

module.exports = { genToken, verToken };
