require('dotenv').config();
require('express-async-errors');
const path = require('path');

const express = require('express');
const app = express();

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//db
const connectDB = require('./db/connect');

//packages
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

//routes
const authRouter = require('./routes/authRoutes');

//middleware
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
//CORS
// const corsOptions = {
//   origin: [
//     'http://localhost:3000',
//     'http://127.0.0.1',
//     'https://test-cookies-yoo.netlify.app',
//     'https://neno-app.netlify.app',
//   ],
//   credentials: true,
//   exposedHeaders: ['set-cookie'],
// };
// app.use(cors(corsOptions));
app.use(cors());

app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(express.static('./public'));
app.use(express.static(path.join(__dirname, '/client/build')));
app.use(fileUpload());
app.use(cookieParser(process.env.JWT_SECRET));

//routes
app.use('/api/v1/auth', authRouter);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

//not found
app.use(notFoundMiddleware);
//error handler
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.DB_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
