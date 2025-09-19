

import express from 'express'
import dotenv from 'dotenv'
import { sql } from './config/db.js'



dotenv.config()

const app =express()
const PORT = process.env.PORT ||5001
 async function initDB() {
    try {
        await sql `CREATE TABLE IF NOT EXIST transaction(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,

            
            )`
    } catch (error) {
        
    }
    
 }

app.listen(PORT ,()=>{
    console.log("Server is running  on Port: 5001")
})