const autherModel = require("../model/AutherModel1")
const validate = require("../validator/validator1")

const createAuther = async function (req, res) {
    try {
        let data = req.body
        let val = validate.checker(data)
        if (val) {
            res.status(400).send({ status:false,msg : val })
        }
        if (!val) {
            let savedData = await autherModel.create(data)
            res.status(201).send({ status:true,msg: savedData })
        }
    }
    catch (err) {
        res.status(500).send({ status:false,msg: err.message })
    }
}


module.exports.createAuther = createAuther;


