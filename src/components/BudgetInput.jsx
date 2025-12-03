import { useState } from 'react'
import { Box, TextField, Button } from '@mui/material'

export default function BudgetInput({ value = 0, onChange }) {
  const [input, setInput] = useState(String(value || ''))

  function submit(e) {
    e.preventDefault()
    const n = parseFloat(input || '0')
    if (Number.isNaN(n)) return
    onChange(n)
  }

  return (
    <Box component="form" onSubmit={submit} sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
      <TextField
        label="Starting budget (USD)"
        type="number"
        inputProps={{ step: '0.01', min: '0' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="0.00"
        size="small"
        fullWidth
      />
      <Button type="submit" variant="contained" size="medium">
        Set
      </Button>
    </Box>
  )
}
