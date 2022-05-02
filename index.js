require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db/db');
const router = require('./routes');
const errorHandlingMiddleware = require('./middlewares/errorHandlingMiddleware');

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandlingMiddleware);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) });
    } catch (error) {
        console.log(error);
    }
}

start();