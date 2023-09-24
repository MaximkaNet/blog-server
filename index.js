// init dotenv file
require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

const app = express()
const sequelize = require('./models/init')
const router = require('./routers/index')
const errorMiddleware = require('./middlewares/error_middleware')

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/images', express.static(path.join(__dirname, 'static', 'images')))
app.use('/files', express.static(path.join(__dirname, 'static', 'files')))
app.use(router)

// error middleware
app.use(errorMiddleware)

async function serverStart() {
    try {
        await sequelize.authenticate()
        // await sequelize.sync({ alter: true })
        // await sequelize.drop()
        app.listen(PORT, () => {
            console.log("Server started on port: " + PORT)
            console.log(`http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error(error)
    }
}

serverStart()