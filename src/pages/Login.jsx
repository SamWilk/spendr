import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box, TextField, Button, Typography, Alert, Paper } from '@mui/material'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email and password are required')
      return
    }
      try {
        const thing = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        })
        const data = await thing.json()
        console.log('Supabase-login API response:', data)
        localStorage.setItem('spendr_logged_in', 'true')
        navigate('/')
      } catch (error) {
        console.error(error)
        setError('Invalid email or password')
      }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          spendr — Login
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
          Enter your credentials to access your spending tracker.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={ handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            fullWidth
            required
          />

          <TextField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            fullWidth
            required
          />

          <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>
            Log in
          </Button>

        </Box>
      </Paper>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
        Built with Vite + React + Material UI
      </Typography>
    </Container>
  )
}
