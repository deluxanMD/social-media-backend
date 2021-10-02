const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log(`Connected to Mongo DB`);
    app.listen(8800, () => {
      console.log(`Server is running`);
    });
  })
  .catch((err) => {
    console.log(`Connected to Mongo DB`, err);
  });

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

// Routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
