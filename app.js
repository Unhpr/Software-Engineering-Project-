const connectDB = require('./models/db');
connectDB();

const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
require('dotenv').config();


app.use(session({
  secret: process.env.SESSION_SECRET, //ebd49dbc4b9d08e3989c17e413d3d3ce7bc432191ef6bb1d4a81c3f1eaf5f643
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use('/api/goal-check', require('./routes/api-goal-check'));


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const indexRouter = require('./routes/index');
const dietRouter = require('./routes/diet');
const loginRouter = require('./routes/login');
const exerciseRouter = require('./routes/exercise');
const groupRouter = require('./routes/group');

const goalApi = require('./routes/api-goal');
const groupApi = require('./routes/api-group');
const apiFoodRouter = require('./routes/api-food');
const apiWeight = require('./routes/api-weight');
const apiExerciseRouter = require('./routes/api-exercise');

app.use('/', indexRouter);
app.use('/diet', dietRouter);
app.use('/login', loginRouter);
app.use('/exercise', exerciseRouter);
app.use('/group', groupRouter);

app.use('/api/goal', goalApi);
app.use('/api/group', groupApi);
app.use('/api/food', apiFoodRouter);
app.use('/api/exercise', apiExerciseRouter);
app.use('/api/weight', apiWeight);
app.use('/api/auth', require('./routes/api-auth'));
app.get('/signup', (req, res) => {
  res.render('register');  
});

const dashboardRouter = require('./routes/dashboard');
app.use('/', dashboardRouter);



app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});
app.get('/create-goal', (req, res) => {
  if (!req.session.username) return res.redirect('/login');
  res.render('create-goal');
});
app.get('/log-weight', (req, res) => {
  if (!req.session.username) return res.redirect('/login');
  res.render('log-weight');
});




app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
