const mongoose  = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
let blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        authorId: {
            type: ObjectId,
            ref: "Author"
        },

        tags: [String],
        category:
        {
            type: [String],
            required: true,
        },
        subcategory: {
            type: [String],

        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        publishedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
)

module.exports = new mongoose.model("Blog",blogSchema)