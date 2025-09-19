import express from 'express'
import { sql } from "../config/db.js";
import { createTransaction, deleteTransactionm, getTransactionByUserId, getUserAccountSummary } from '../controllers/transaction-controller.js';
const router = express.Router()


// Add the transaction to the DB
router.post("/", createTransaction);


router.get("/:userId", getTransactionByUserId);
  
//delete the transaction
router.delete("/:id", deleteTransactionm);

router.get("/summary/:userId", getUserAccountSummary);

export default router