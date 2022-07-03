const express = require('express')
const app = express()
require('dotenv').config({ path: '../.env' })
const hbs = require('hbs')
const path = require('path')
const knex = require('../config/db_connections')
const { genToken, verToken } = require('../auth/jwt_auth')
const port = process.env.PORT || 4040

app.use(express.json())

app.use(express.urlencoded({ extended: true }))
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.set('view engine', 'hbs')
app.use(express.static(static_path))
app.set('views', template_path)
hbs.registerPartials(partials_path)

/////////////////////////////////////
// signup
app.get('/signup', (req, res) => {
    res.render('signup')
})
// ------ save signup data
app.post('/getData', async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!(name && email && password)) {
            return res.status(400).json({
                status: "error", msg: "please fill all the inputs"
            })
        }
        await knex('users').insert({ name, email, password })
        // res.status(201).json({
        //     status:'created', msg:'User registered successfully'
        // })
        res.redirect("/login")

    } catch (error) {
        res.status(500).json({
            status: 'failed', error: error.message
        })
    }
})

//////////////////////
// login
app.get('/login', (req, res) => {
    res.render('login')
})

// ------------ check user
app.post('/checkUser', async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email && !password) {
            return res.status(400).json({
                status: 'error', msg: "please fill all the inputs"
            })
        }
        const user = await knex('users').where({ email, password })
        const token = genToken(user[0])
        res.cookie('userCookie', token)
        // res.redirect("/blogs")
        res.send('hjfkdsjf')

    } catch (error) {
        res.status(500).json({
            status: 'failed', error: error.message
        })
    }
})
//////////////////////////

// blog posts
app.get("/blogs", (req, res) => {
    res.render("blog")
})

// all blog data
app.get("/data", async (req, res) => {
    const data = await knex("blogData")
    res.send(data)
})

////////////////////////
// Home page
app.get('/', (req, res) => {
    res.render('home')

})
///////////////////////////////

// blog route
app.get('/addblog', (req, res) => {
    res.render('addblog')
})

// write blog
app.post('/addpost', verToken, async (req, res) => {
    // console.log(req.userData);
    const blogerID = req.userData[0].id
    const { title, content } = req.body
    await knex('blogData').insert({ blogerID, title, content })
    res.redirect("/blogs")
    res.send('blog posted')

})


app.listen(port, () => {
    console.log('Connected', port);
})