import React, { useState } from 'react'

export default function ExpenseForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  function submit(e) {
    e.preventDefault()
    const n = parseFloat(amount || '0')
    if (!title || Number.isNaN(n)) return
    onSubmit({ title, amount: Number(n), note })
    setTitle('')
    setAmount('')
    setNote('')
  }

  return (
    <form className="expense-form" onSubmit={submit}>
      <h2>Add expense</h2>
      <div className="grid">
        <input
          aria-label="expense title"
          placeholder="Title (e.g., Groceries)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          aria-label="expense amount"
          placeholder="Amount (USD)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          step="0.01"
        />
        <input
          aria-label="optional note"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="actions">
        <button type="submit">Add</button>
      </div>
    </form>
  )
}
