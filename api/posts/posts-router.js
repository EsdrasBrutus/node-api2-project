// implement your posts router here
const Posts = require('./posts-model')
const express = require("express")
const router =express.Router()

router.get('/', (req, res) =>{
   Posts.find(req.query)
    .then(posts =>{
        res.status(200).json(posts);
    })
    .catch(err =>{
        res.status(500).json({message: "The posts information could not be retrieved"})
    })
})

router.get('/:id', (req, res) =>{
    const { id } =req.params
    Posts.findById(id)
        .then(post =>{
            if (post){
                res.status(200).json(post)
            }
            else(
                res.status(404).json({message: "The post with the specified ID does not exist"})
            )
        })
        .catch(err =>{
            res.status(500).json({message: "The post information could not be retrieved"})
        })
})

router.post('/', (req, res) =>{
    const newPost = req.body
    if (!newPost.title || !newPost.contents){
        res.status(400).json({message: "Please provide title and contents for the post" })
    }
    else {
        Posts.insert(newPost)
            .then(post =>{
                res.status(201).json(post)
            })
            .catch(err =>{
                res.status(500).json({message: "There was an error while saving the post to the database"})
            })
    }
})

router.put('/:id', (req, res) =>{
    const { id } = req.params
    const changes = req.body
    Posts.update(id, changes)
        .then(update => {
            if (!update){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }
            else{
                if (!changes.title || !changes.contents){
                    res.status(400).json({message: "Please provide title and contents for the post" })
                }
                else{
                    res.status(200).json(update)
                }
            }
        })
        .catch(err =>{
            res.status(500).json({message: "The post information could not be modified" })
        })
})

router.delete('/:id', (req, res) =>{
    const { id } = req.params

    Posts.remove(id)
        .then( deleted => {
            if (!deleted){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }
            else {
                res.status(200).json(deleted)
            }
        })
        .catch(err =>{
            res.status(500).json({message: "The post could not be removed"})
        })
       

})

router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
        .then(comments => {
            if(comments.length > 0) {
                res.status(200).json(comments);
            }
            else {
                res.status(404).json({message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => [
            res.status(500).json({ message: "The comments information could not be retrieved"})
        ])
})


module.exports = router