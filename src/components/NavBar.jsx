import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggedIn = localStorage.getItem('spendr_logged_in') === 'true'

  function handleAuthClick() {
    if (isLoggedIn) {
      localStorage.removeItem('spendr_logged_in')
      navigate('/login')
    } else {
      navigate('/login')
    }
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          spendr
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!isLoggedIn && location.pathname !== '/signup' && (
            <Button 
              color="inherit" 
              onClick={() => navigate('/signup')}
              startIcon={<PersonAddIcon />}
            >
              Sign Up
            </Button>
          )}
          {location.pathname !== '/login' && location.pathname !== '/signup' && (
            <Button 
              color="inherit" 
              onClick={handleAuthClick}
              startIcon={isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
