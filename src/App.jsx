import { useEffect, useMemo, useState } from 'react'
import './App.css'
import BudgetInput from './components/BudgetInput'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

const LS_BUDGET = 'spendr_budget_v1'
const LS_EXPENSES = 'spendr_expenses_v1'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function App() {
  const [budget, setBudget] = useState(() => {
    const raw = localStorage.getItem(LS_BUDGET)
    return raw != null ? Number(raw) : 0
  })

  const [expenses, setExpenses] = useState(() => {
    const raw = localStorage.getItem(LS_EXPENSES)
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch (e) {
        console.error('Failed to parse expenses from localStorage', e)
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem(LS_BUDGET, String(budget))
  }, [budget])

  useEffect(() => {
    localStorage.setItem(LS_EXPENSES, JSON.stringify(expenses))
  }, [expenses])

   const callAPI = async () => {
    try {
      const response = await fetch('/api/supabase-now');
      const data = await response.json();
      console.log('API Response:', data);
    } catch (error) {
      console.error('Error calling API:', error);
    }
  }

  useEffect(() => {
    callAPI();
  }, [])

  const totalSpent = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount || 0), 0), [expenses])
  const remaining = useMemo(() => Number(budget) - totalSpent, [budget, totalSpent])

  function addExpense(expense) {
    setExpenses((prev) => [{ id: Date.now(), date: new Date().toISOString(), ...expense }, ...prev])
  }

  function updateExpense(id, patch) {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  function deleteExpense(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div id="app-root">
      <header>
        <h1>spendr — Simple Spending Tracker</h1>
        <p className="muted">Set a starting budget, add expenses, edit or delete them. Data is saved in your browser.</p>
      </header>

      <section className="controls">
        <BudgetInput value={budget} onChange={(v) => setBudget(Number(v))} />
        <div className="summary">
          <div>
            <div className="label">Budget</div>
            <div className="value">{formatCurrency(Number(budget) || 0)}</div>
          </div>
          <div>
            <div className="label">Spent</div>
            <div className="value spent">{formatCurrency(totalSpent)}</div>
          </div>
          <div>
            <div className="label">Remaining</div>
            <div className={`value ${remaining < 0 ? 'negative' : ''}`}>{formatCurrency(remaining)}</div>
          </div>
        </div>
      </section>

      <main>
        <ExpenseForm onSubmit={addExpense} />
        <ExpenseList items={expenses} onUpdate={updateExpense} onDelete={deleteExpense} />
      </main>

      <footer className="muted">Built with Vite + React — localStorage persistence</footer>
    </div>
  )
}

export default App
