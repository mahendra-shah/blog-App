const express = require('express')
const app = express()
require('dotenv').config({ path: '../.env' })
const hbs = require('hbs')
const path = require('path')
const { genToken, verToken } = require('../auth/jwt_auth')
const {PrismaClient} = require('@prisma/client')
const upload = require('../modules/multer')
const cloudinary = require('../modules/cloudinary')
const prisma = new PrismaClient
const port = 4040

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
app.post('/getData', async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!(name && email && password)) {
            return res.status(400).json({
                status: "error", msg: "please fill all the inputs"
            })
        }
        await prisma.users.create({
            data:{name, email, password}
        })
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
app.post('/checkUser', async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email && !password) {
            return res.status(400).json({
                status: 'error', msg: "please fill all the inputs"
            })
        }
        const user = await prisma.users.findUnique({
            where:{
                email
            }
        })
        const token = genToken(user)
        res.cookie('userCookie', token)
        res.redirect("/blogs")

    } catch (error) {
        res.status(500).json({
            status: 'failed', error: error.message
        })
    }
})
//////////////////////////

// blog posts
app.get("/blogs", verToken, (req, res) => {
    res.render("blog")
})

// all blog data
app.get("/dataofallblogs", verToken, async (req, res) => {
    const data =  await prisma.blogs.findMany()
    res.send(data)
})

////////////////////////
// Home page
app.get('/', (req, res) => {
    res.render('home')

})
///////////////////////////////

// blog route write blog
app.get('/addblog', verToken,(req, res) => {
    res.render('addblog')
})
app.post('/addpost', verToken, upload.single('image'), async (req, res) => {
    const userId = parseInt(req.userData.id)
    const img = await cloudinary.uploader.upload(req.file.path)
    const image = img.secure_url
    const { title, content } = req.body

    await prisma.blogs.create({
        data:{
            userId, title, content, image
        }
    })
    res.redirect("/blogs")

})

// profile
app.get('/profile', verToken, async(req, res)=>{
    res.render('profile')
})

// 404 page
app.get("*", (req, res) => {
    res.render("404", {
        errorMsg: 'Opps! Page Not Found'
    });
});

app.listen(port, () => {
    console.log('Connected to', port);
})