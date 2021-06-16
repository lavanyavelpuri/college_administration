const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

router.get('/signup', (req,res) => {
    res.render('signup')
})

router.get('/login', (req,res) => {
    res.render('login')
})


// router.get('/student/:id', (req,res) => {
//     res.send(`Saved the record ${req.params.id}`)
// })

// router.get('/staff/:id', (req,res) => {
//     res.send(`Saved the record ${req.params.id}`)
// })


module.exports = router;