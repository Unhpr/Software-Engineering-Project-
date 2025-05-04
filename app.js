const connectDB = require('./models/db');
connectDB();

const express = require('express');
const path = require('path');
const app = express();

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

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
