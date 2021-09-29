import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    comments: [
        {
            text: String,
            postedBy: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
        },
    ],
    postedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema);