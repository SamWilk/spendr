import { useState } from 'react'
import { Box, TextField, Button, Typography, Paper } from '@mui/material'

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
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add expense
      </Typography>
      <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Title"
            placeholder="e.g., Groceries"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ flex: '1 1 200px' }}
            required
          />
          <TextField
            label="Amount (USD)"
            type="number"
            inputProps={{ step: '0.01' }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ flex: '1 1 150px' }}
            required
          />
          <TextField
            label="Note (optional)"
            placeholder="Optional note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{ flex: '1 1 200px' }}
          />
        </Box>
        <Button type="submit" variant="contained" size="large">
          Add Expense
        </Button>
      </Box>
    </Paper>
  )
}
