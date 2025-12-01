import React, { useState } from 'react'

function Item({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [amount, setAmount] = useState(String(item.amount))
  const [note, setNote] = useState(item.note || '')

  function save() {
    const n = parseFloat(amount || '0')
    if (!title || Number.isNaN(n)) return
    onUpdate(item.id, { title, amount: Number(n), note })
    setEditing(false)
  }

  return (
    <li className="expense-item">
      <div className="left">
        <div className="title">{item.title}</div>
        <div className="note">{item.note}</div>
      </div>
      <div className="right">
        {editing ? (
          <div className="edit">
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="row-actions">
              <button onClick={save}>Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="amount">${Number(item.amount).toFixed(2)}</div>
            <div className="actions">
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={() => onDelete(item.id)}>Delete</button>
            </div>
          </>
        )}
      </div>
    </li>
  )
}

export default function ExpenseList({ items = [], onUpdate, onDelete }) {
  if (!items.length) return <p className="muted">No expenses yet — add one above.</p>

  return (
    <section className="expense-list">
      <h2>Expenses</h2>
      <ul>
        {items.map((it) => (
          <Item key={it.id} item={it} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </ul>
    </section>
  )
}
