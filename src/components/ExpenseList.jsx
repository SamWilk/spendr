import { useState } from 'react'
import { Box, Typography, Paper, List, ListItem, TextField, Button, IconButton, Chip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

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

  if (editing) {
    return (
      <ListItem sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <TextField size="small" value={title} onChange={(e) => setTitle(e.target.value)} label="Title" sx={{ flex: '1 1 150px' }} />
        <TextField size="small" type="number" inputProps={{ step: '0.01' }} value={amount} onChange={(e) => setAmount(e.target.value)} label="Amount" sx={{ flex: '0 1 120px' }} />
        <TextField size="small" value={note} onChange={(e) => setNote(e.target.value)} label="Note" sx={{ flex: '1 1 150px' }} />
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton color="primary" onClick={save} size="small"><SaveIcon fontSize="small" /></IconButton>
          <IconButton onClick={() => setEditing(false)} size="small"><CancelIcon fontSize="small" /></IconButton>
        </Box>
      </ListItem>
    )
  }

  return (
    <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body1" fontWeight={600}>{item.title}</Typography>
        {item.note && <Typography variant="body2" color="text.secondary" noWrap>{item.note}</Typography>}
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Chip label={`$${Number(item.amount).toFixed(2)}`} color="primary" />
        <IconButton size="small" onClick={() => setEditing(true)}><EditIcon fontSize="small" /></IconButton>
        <IconButton size="small" color="error" onClick={() => onDelete(item.id)}><DeleteIcon fontSize="small" /></IconButton>
      </Box>
    </ListItem>
  )
}

export default function ExpenseList({ items = [], onUpdate, onDelete }) {
  if (!items.length) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          No expenses yet — add one above.
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Expenses
      </Typography>
      <List sx={{ p: 0 }}>
        {items.map((it) => (
          <Item key={it.id} item={it} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </List>
    </Paper>
  )
}
