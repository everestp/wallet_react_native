import express from 'express'
import { sql } from "../config/db.js";
const router = express.Router()


// Add the transaction to the DB
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !user_id || !category || amount === undefined) {
      return resizeBy.status(400).json({
        message: "All field are required",
      });
    }
    const transaction = await sql`
    INSERT INTO transactions(user_id ,title ,amount ,category)
    VALUES(${user_id} ,${title} ,${amount},${category})
    RETURNING *
    
    `;

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating transaction");

    res.status(500).json({
      message: "Internal Server error",
    });
  }
});


router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
  
//delete the transaction
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        message: "Invalid ID",
      });
    }
    const result = await sql`DELETE FROM  transactions WHERE id = ${id}
    RETURNING *

    
    `;

    if (result.length === 0) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }
    res.status(200).json({
      message: "Transaction delete sucessfully",
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions
      WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses
      FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.error("Error getting summary:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router