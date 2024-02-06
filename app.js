require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const dayjs = require("dayjs")
//import dayjs from 'dayjs' // ES 2015
dayjs().format()
const port = process.env.PORT ;


//mongoose stuff
const mongoose = require('mongoose');
const ShoppingList = require("./models/ShoppingList");
/* const db_url = 'process.env.DATABASE_URL' */
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.once("open", () => console.log("connected to mongoDB"));

const app = express()
app.use(morgan('dev'))
app.use(express.json())

//endpoints
//GET all
app.get('/shoppinglists', (req, res) => {
    ShoppingList.find().then((results) => res.status(200).json(results))
})
//POST new list
app.post('/shoppinglists', (req, res) => {
    const newShoppingList = new ShoppingList(req.body)
    newShoppingList.save()
    res.status(201).json(newShoppingList)
})
//GET target list
app.get('/shoppinglists/:shoppinglistId', (req, res) => {
    ShoppingList.findById(req.params.shoppinglistId)
      .then((results) => {
        if (results) {
          res.status(200).json(results)
        } else {
          res.status(404).json({ message: 'not found' })
        }
      })
      .catch((error) => res.status(400).json({ message: 'Bad request' }))
  })
  //PATCH target list
  app.patch('/shoppinglists/:shoppinglistId', (req, res) => {
    ShoppingList.findById(req.params.shoppinglistId).then((shoppinglist) => {
        if (shoppinglist) {
        shoppinglist.title = req.body.title || shoppinglist.title
        shoppinglist.updatedAt = req.body.updatedAt 
        shoppinglist.save()
        res.status(200).json(shoppinglist)
    }else {
        res.status(404).json({ "message": "not found" })
    }})
    .catch((error) => res.status(404).json({ "message": "bad request" }))
})
  //DELETE
  app.delete('/shoppinglists/:shoppinglistId', (req, res) => {
    ShoppingList.findById(req.params.shoppinglistId).then((results) => {
        if (bookmark) {
            //delete 
        }else {
            res.status(404).json({ "message": "not found" })
        }})
        .catch((error) => res.status(404).json({ "message": "bad request" }))
})

  //all-else error
  app.get('*', function (req, res) {
    res.status(404).json({ error: 'route not found' })
  })

  app.listen(port, () => console.log(`Application is running on port ${port}`))