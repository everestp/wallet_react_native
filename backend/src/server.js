

import express from 'express'
import dotenv from 'dotenv'
import { sql } from './config/db.js'



dotenv.config()

const app =express()
app.use(express.json())
const PORT = process.env.PORT ||5001
 async function initDB() {
    try {
        await sql `CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10 ,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
            

            
            )`
            console.log("Database intialized sucessfully")
    } catch (error) {
        console.log("Error intilaizing DB ",error)
        process.exit(1)
    }
    
 }

app.get('/api/transaction/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const transactions = await sql`
      SELECT * FROM transactions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    res.status(200).json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
})


 // Add the transaction to the DB
 app.post("/api/transaction", async (req ,res)=>{
  try {
    const {title ,amount ,category ,user_id} = req.body
    if(!title || !user_id || !category || amount ===undefined){
        return resizeBy.status(400).json({
            message:"All field are required"
        })
    }
     const transaction =  await sql `
    INSERT INTO transactions(user_id ,title ,amount ,category)
    VALUES(${user_id} ,${title} ,${amount},${category})
    RETURNING *
    
    `

 console.log(transaction)
 res.status(201).json(transaction[0])



  } catch (error) {
    console.log("Error creating transaction")
    
    res.status(500).json({
        message :"Internal Server error"
    })
  }
 })

 //delete the transaction
 app.delete('/api/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params
     if(isNaN(parseInt(id))){
        return res.status(400).json({
           message:"Invalid ID"
        })
     }
    const result =  await sql `DELETE FROM  transactions WHERE id = ${id}
    RETURNING *

    
    `

    if(result.length ===0){
        return res.status(404).json({
           message:"Transaction not found"
        })
    }
    res.status(200).json({
           message:"Transaction delete sucessfully"
        })

  } catch (error) {
    console.error("Error fetching transactions:", error)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
})

initDB().then(()=>{
    app.listen(PORT ,()=>{
        console.log("Server is started at PORT",PORT)
    })
})