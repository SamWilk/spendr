import React, { useState } from 'react'

export default function BudgetInput({ value = 0, onChange }) {
  const [input, setInput] = useState(String(value || ''))

  function submit(e) {
    e.preventDefault()
    const n = parseFloat(input || '0')
    if (Number.isNaN(n)) return
    onChange(n)
  }

  return (
    <form className="budget-input" onSubmit={submit}>
      <label>
        Starting budget (USD)
        <div className="row">
          <input
            type="number"
            step="0.01"
            min="0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="0.00"
            aria-label="starting budget"
          />
          <button type="submit">Set</button>
        </div>
      </label>
    </form>
  )
}
