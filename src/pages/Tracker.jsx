import { useEffect, useMemo, useState } from 'react'
import { Container, Box, Typography, Paper, Grid } from '@mui/material'
import BudgetInput from '../components/BudgetInput'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'

const LS_BUDGET = 'spendr_budget_v1'
const LS_EXPENSES = 'spendr_expenses_v1'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function Tracker() {
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
      const response = await fetch('/api/supabase-now')
      const data = await response.json()
      console.log('API Response:', data)
    } catch (error) {
      console.error('Error calling API:', error)
    }
  }

  useEffect(() => {
    callAPI()
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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          spendr — Simple Spending Tracker
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
          Set a starting budget, add expenses, edit or delete them. Data is saved in your browser.
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <BudgetInput value={budget} onChange={(v) => setBudget(Number(v))} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-around' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Budget</Typography>
                <Typography variant="h6">{formatCurrency(Number(budget) || 0)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Spent</Typography>
                <Typography variant="h6" color="warning.main">{formatCurrency(totalSpent)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Remaining</Typography>
                <Typography variant="h6" color={remaining < 0 ? 'error.main' : 'success.main'}>
                  {formatCurrency(remaining)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <ExpenseForm onSubmit={addExpense} />
      </Box>

      <ExpenseList items={expenses} onUpdate={updateExpense} onDelete={deleteExpense} />

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
        Built with Vite + React + Material UI — localStorage persistence
      </Typography>
    </Container>
  )
}
