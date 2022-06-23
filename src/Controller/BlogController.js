const blogModel = require("../model/BlogModel1")
const validator = require("../validator/validator")

const createBlog = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "NO credential to create a blog" })
        let AuthorId = await blogModel.find({ _id: data.authorId })
        if (AuthorId) {
            let savedData = await blogModel.create(data)
            res.status(201).send({ status: true, msg: savedData })
        }
        if (!AuthorId) {
            res.status(400).send({ msg: "authorid is not valid" })
        }
    }
    catch (err) { res.status(500).send({ status: false, msg: err.message }) }
}


const getBlog = async function (req, res) {
    try {
        //getting data from query params
        let filters = req.query
        console.log(filters)
        //checking if there is any filter present or not
        if (Object.keys(filters).length >= 1) {
            //adding more conditions to the filter
            filters.isDeleted = false
            filters.isPublished = true
            //checking if we have a tag filter to match
            if (filters.tags) {
                //if we have a tag filter then we are adding this condition to the filter
                filters.tags = { $elemMatch: { $eq: filters.tags } }
                console.log(filters)
            }
            //checking if we have a subcatagory filter to match
            if (filters.subcategory) {
                //if we have a subcatagory filter then we are adding this conditon to the filter
                filters.subcategory = { $elemMatch: { $eq: filters.subcategory } }
            }
            //finding the data using the filter
            let filteredBlogs = await blogModel.find(filters)
            if (filteredBlogs.length === 0) return res.status(404).send({ status: false, msg: "No such data available" })
            else return res.status(200).send({ status: true, msg: filteredBlogs })
        }
        let blogs = await blogModel.find({ isDeleted: false, isPublished: true })
        if (blogs.length == 0) res.status(404).send({ status: false, msg: "No result found" })
        res.status(200).send({ status: true, msg: blogs })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const updateBlog = async function (req, res) {

    try {
        let blogId = req.params.blogId;
        if (!blogId) return res.status(400).send({ status: false, msg: "no id found" })
        let user = await blogModel.findById(req.params.blogId);

        if (Object.keys(user) === 0 || user.isDeleted === true) {
            return res.status(401).send({ status: false, msg: " no such data found" });
        }

        let userData = req.body;
        if (Object.keys(userData).length === 0) return res.status(400).send({ status: false, msg: "no data to update" })
        userData.isPublished = true
        userData.publishedAt = new Date()
        let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, userData, { new: true });
        console.log(updatedBlog)
        res.status(200).send({ status: true, msg: updatedBlog });

    } catch (err) {
        console.log("This is the error:", err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
};


const deleteBlogById = async function (req, res) {

    try {
        let id = req.params.blogId;
        if (!validator.isValidObjectId(id)) {
            return res
                .status(400)
                .send({ status: false, message: `BlogId is invalid.` });
        }

        let data = await blogModel.findOne({ _id: id, isDeleted: false });
        if (!data) {
            return res.status(400).send({ status: false, message: "No such blog found" })
        }
        let Update = await blogModel.findOneAndUpdate({ _id: id, }, { isDeleted: true, deletedAt: new Date() }, { new: true })
        res.status(200).send({ status: true, msg: Update })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
const deleteByQuery = async function (req, res) {
    try {
        //geting any conditions present in the req.query
        let conditions = req.query
        //validating the user defined queries 
        if (!validator.isValidRequestBody(req.query)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide query details" });
        }
        //checking, if isDeleted is already present in the query if not then adding it to the condtions
        if (!conditions.isDeleted) {

            conditions.isDeleted = false
        }
        //checking if there is an authorId present in the conditions. If it is then valididating the id
        if (conditions.authorId) {
            if (!validator.isValidObjectId(conditions.authorId)) {
                return res.status(400).send({ status: false, message: `authorId is not valid.` });
            }
        }
        //checking if tag is present in the condition if it is then adding new conditionns for tags
        if (conditions.tags) {
            conditions.tags = { $elemMatch: { $eq: conditions.tags } }
        }
        //checking if subcategory is present in the condition if it is then adding new conditions for subcategory
        if (conditions.subcategory) {
            conditions.subcategory = { $elemMatch: { $eq: conditions.subcategory } }
        }
        //finding if any data present with that conditions 
        let data = await blogModel.find(conditions);
        //if no data exist like this then sending error
        if (!data) {
            return res.status(404).send({ status: false, message: "no such data exists" })
        }
        //deleting the data using that conditions
        let Update = await blogModel.updateMany({ conditions }, { isDeleted: true, deletedAt: new Date() }, { new: true })
        res.status(200).send({ status: true, data: Update })
    } catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }

}


module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.deleteBlogById = deleteBlogById
module.exports.deleteByQuery = deleteByQuery
module.exports.updateBlog = updateBlog




