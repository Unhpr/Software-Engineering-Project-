const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Route imports
const indexRouter = require('./routes/index');
const dietRouter = require('./routes/diet');
const loginRouter = require('./routes/login');
const exerciseRouter = require('./routes/exercise');
const groupRouter = require('./routes/group');

// Route usage
app.use('/', indexRouter);
app.use('/diet', dietRouter);
app.use('/login', loginRouter);
app.use('/exercise', exerciseRouter);
app.use('/group', groupRouter);

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
