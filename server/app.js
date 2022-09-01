require('dotenv').config();
const express = require('express');

const app = express();
app.use(require('morgan')('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('cors')({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

// Static content: web-client path AS virtual, server path
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.static(path.resolve('public')));

require('./middlewares/session')(app);

app.use('/', require('./routes/index'));

const { sequelize } = require('./db/models');

app.listen(process.env.PORT, async () => {
  console.log(`Server start working on PORT: ${process.env.PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
});
