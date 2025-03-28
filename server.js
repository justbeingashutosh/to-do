const express = require('express');
const app = express();
const port = 8000 || process.env.PORT;
const path = require('path');
const mongoose = require('mongoose')
const ejs = require('ejs');
const override = require('method-override')
require('dotenv').config()
const atlasURI = process.env.DBURI
// console.log("Logging Database Connection URI: ", atlasURI)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(override('_method'));

mongoose.connect(atlasURI, {useUnifiedTopology: true})
.then(()=>{
    console.log("Connected to database")
})
.catch((err)=>{
    console.log(err)
})

const taskSchema = new mongoose.Schema({
    task: {type: String},
    isDone: {type: Boolean, default: false},
}, {_id: true})

const userSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String,
    tasks: [taskSchema]
}, {minimize: false})

const users = mongoose.model("users", userSchema)

// User Authentication Implementation -------------------------------------------------------------------------------------------------


const passport = require('passport') //Import the base module. Any strategy i use will require this module.
const LocalStrategy = require('passport-local') //Import the local strategy
//This will actually import a constructor function that can be used to construct local strategies.
const mongoStore = require('connect-mongo') //Stores session data in mongo database.
const crypto = require('crypto') //Import module to hash passwords
const session = require('express-session')

passport.serializeUser((user, cb)=>{ //Function to store the user id in session.passport.user
    cb(null, user.id)
})

passport.deserializeUser(async(id, cb)=>{ //Function to retreive user info upon subsequent requests.
    try{
        const user = await users.findById(id)
        cb(null, user)
    }
    catch(e){
        cb(e)
    }
})

app.use(session({
    secret: "sklmxms",
    store: mongoStore.create({mongoUrl: atlasURI}),
    cookie: {maxAge: 1000*60*60*72},
}))

app.use(passport.initialize())
app.use(passport.session()) //Gives session access to passport

const strategy = new LocalStrategy({
    usernameField: "username", //Name of input element in which username will be entered
    passwordField: "password" // Name of input element where password will be entered.
}, verify) //The function that will be used to verify the entered username and password combination.

passport.use(strategy) //Link the local strategy to base passport module

async function verify(username, password, done){
    try{
        users.findOne({username: username}).then((user)=>{
            if(!user){
                console.log("User not in database")
                return done(null, false)
            }
            // console.log("Logging salt: ", user)
            const valid = validate(password, user.salt, user.hash)
            if(valid){
                return done(null, user)
            }
            else{
                return done(null, false)
            }
        })
    }
    catch(e){
        done(e)
    }
}

function validate(password, salt, hash){
    const hashed = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString('hex')
    return hashed === hash
}
// ------------------------------------------------------------------------------------------------

function hashPassword(password){
    const salt = crypto.randomBytes(32).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString('hex')
    return {salt, hash}
}

app.get('/home', async(req, res) => {
    const userData = await users.findOne({username: req.user.username});
    // console.log("Logging user data tasks: ", userData.tasks)
    res.render('index', {userData: userData.tasks});
});
app.get('/', (req, res)=>{
    if(req.user){
        res.redirect('/home')
        return
    }
    res.render('home')
})
app.get('/login', (req, res) => {
    // console.log("Get request recieved at login route.")
    if(req.user){
        res.redirect('/home')
        return
    }
    res.render('login')
});
app.post('/login', async(req, res, next)=>{
    const {username, password} = req.body
    const user = await users.findOne({username: username})
    if(!user){
        return res.render('login', { data: { msg:  "That username does not exist. Please create a new account."} , username: username, password: password})
    }else{
        if(!validate(password, user.salt, user.hash)){
            return res.render('login', { data: { msg: "Wrong Password." }, username: username, password: password})
        }
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login"
    })(req, res, next)
    }
})
app.get('/register', async(req, res) => {
    if(req.user){
        res.redirect('/home')
        return
    }
    res.render('register')
})
app.post('/register', async(req, res)=>{
    const {username, password} = req.body
    // console.log(username, password)
    const user = await users.findOne({username: username})
    if(user){
        res.render('register', {data:{msg: "That user already exists. Please choose a different username or login."}})
        return
    }else{
        const {salt, hash} = hashPassword(password)
        await users.create({
            username: username,
            salt: salt,
            hash: hash,
            tasks: []
        })
        res.redirect('/login')
    }
})
app.post('/tasks/:id/done', async(req, res) => {
    await users.findOneAndUpdate(
        { username: req.user.username, "tasks._id": req.params.id }, // Find the user and task
        { $set: { "tasks.$.isDone": req.body.isDone } }, // Update the isDone field of the matched task
        { new: true }
    );
    res.redirect('/')
})
app.post('/tasks', async(req, res) => { 
    const {task, isDone} = req.body
    const userData = await users.findOneAndUpdate(
        { username: req.user.username }, // Find the user
        { $push: { tasks: { task, isDone } } }, // Push new task
        { new: true } // Return the updated document
    );
    const id = userData.tasks[userData.tasks.length-1].id
    res.json({id, task, isDone})
})
app.get('/logout', (req, res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
        res.redirect('/')
        return
    })
   
})
app.listen(port, () => console.log(`listening on port ${port}`));