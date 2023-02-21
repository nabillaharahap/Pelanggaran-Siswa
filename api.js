const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const moment = require("moment/moment")
const md5 = require("md5")
const siswarouter = require("./siswa")
const userrouter = require("./user")
const pelanggaranrouter = require("./pelanggaran")
const transaksirouter = require("./transaksi")


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(siswarouter)
app.use(userrouter)
app.use(pelanggaranrouter)
app.use(transaksirouter)


app.listen(8000, () => {
    console.log("berhasil");
})

