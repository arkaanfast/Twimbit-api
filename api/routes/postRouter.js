import { Router } from 'express'
import { Post } from '../models/postModel.js';
import verifyToken from '../middelwares/verifyToken.js';


const router = Router();




router.post('/createPost', verifyToken, (req, res) => {

    const { title, content } = req.body;
    req.user.password = undefined;
    const post = new Post({
        title,
        content,
        postedBy: req.user,
    });
    post
        .save()
        .then((_) => {
            res.status(200).json({ 'result': "Created" })
        })
        .catch((err) => {
            res.status(500).json({ 'error': err });
            console.log(err);
        });

});

router.get('/allPosts', verifyToken, (req, res) => {
    console.log(req.query.start || 0);
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then((posts) => res.json({ posts }))
        .catch((err) => {
            res.status(500).json({ 'error': err });
        });
});


router.post('/likePost', verifyToken, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(500).json({ error: err })
        } else {
            res.status(200).json(result)
        }
    })
})

router.post('/unlikePost', verifyToken, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(500).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

router.post('/commentPost', verifyToken, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(500).json({ error: err })
            } else {
                res.status(201).json(result)
            }
        })
})


export default router