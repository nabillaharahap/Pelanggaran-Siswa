const express = require("express")
const router = express.Router()
const multer = require("multer") // untuk upload file
const path = require("path") // untuk memanggil path direktori
const fs = require("fs") // untuk manajemen file
const db = require("./db")

const app = express()
app.use(express.static(__dirname));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "image-"+ Date.now() + path.extname(file.originalname))
    }
})


let upload = multer({storage: storage})


router.post("/pelanggaran", upload.single("image"), (req, res) => {
    let data = {
        id_pelanggaran: req.body.id_pelanggaran,
        nama_pelanggaran: req.body.nama_pelanggaran,
        poin: req.body.poin,
        image: req.file.filename
    }


    if (!req.file) {
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        let sql = "insert into pelanggaran set ?"

        db.query(sql, data, (error, result) => {
            if(error) throw error
            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})

router.put("/pelanggaran", upload.single("image"), (req,res) => {
    let data = null, sql = null
    let param = { id_pelanggaran: req.body.id_pelanggaran }


    if (!req.file) {
        // jika tidak ada file yang dikirim = update data saja
        data = {
            id_pelanggaran: req.body.id_pelanggaran,
            nama_pelanggaran: req.body.nama_pelanggaran,
            poin: req.body.poin
    
        }
    } else {
        // jika mengirim file = update data + reupload
        data = {
            id_pelanggaran: req.body.id_pelanggaran,
            nama_pelanggaran: req.body.nama_pelanggaran,
            poin: req.body.poin,
            image: req.file.filename
        }


        sql = "select * from pelanggaran where ?"
        // run query
        db.query(sql, param, (err, result) => {
            if (err) throw err
            // tampung nama file yang lama
            let fileName = result[0].image


            // hapus file yg lama
            let dir = path.join(__dirname,"image",fileName)
            fs.unlink(dir, (error) => {})
        })


    }


    // create sql update
    sql = "update pelanggaran set ? where ?"

    // run sql update
    db.query(sql, [data,param], (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil diubah"
            })
        }
    })
})

router.delete("/pelanggaran/:id_pelanggaran", (req,res) => {
    let param = {id_pelanggaran: req.params.id_pelanggaran}


    // ambil data yang akan dihapus
    let sql = "select * from pelanggaran where ?"

    // run query
    db.query(sql, param, (error, result) => {
        if (error) throw error

        // res.json({result: result})
        
        // tampung nama file yang lama
        let fileName = result[0].image


        // hapus file yg lama
        let dir = path.join(__dirname,"image",fileName)
        fs.unlink(dir, (error) => {})
    })


    // create sql delete
    sql = "delete from pelanggaran where ?"


    // run query
    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil dihapus"
            })
        }      
    })
})

// endpoint ambil data barang
router.get("/pelanggaran", (req, res) => {
    // create sql query
    let sql = "select * from pelanggaran"


    // run query
    db.query(sql, (error, result) => {
        if (error) throw error
        res.json({
            data: result,
            count: result.length
        })
    })
})

module.exports = router