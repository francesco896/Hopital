import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Typography, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home'; 
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 
import PersonIcon from '@mui/icons-material/Person'; 
import LoginIcon from '@mui/icons-material/Login'; 
import PersonAddIcon from '@mui/icons-material/PersonAdd'; 
import GroupIcon from '@mui/icons-material/Group'; 
import App from './App';
import Registrazione from './Registrazione';
import Contatta from './contatta';
import Access from './Access';
import Junior from './junior';
import Senior from './senior';
import ViewCallendar from './viewcalendar';
import Calendar from './Calendar'; 
import Profilo from './profilo';
import Team from './team';
import Richiesta from './richiesta';
import { useUser } from './userContext';

function Routing() {
  const [open, setOpen] = useState(false);
  const { user } = useUser(); 

  const toggleDrawer = (open) => () => {
    setOpen(open);
  };

  const drawer = (
    <div>
      <Typography variant="h6" sx={{ padding: 2, color: '#fff' }}>
        Hopital
      </Typography>
      <Divider sx={{ borderColor: '#fff' }} />
      <List>
        {
          user && user.role === 'junior' && (
          <>
            <ListItem button component={Link} to="/junior" onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
              <ListItemIcon sx={{ color: '#fff' }}>
                <HomeIcon /> {/* Icona Home */}
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/viewcalendar" onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
              <ListItemIcon sx={{ color: '#fff' }}>
                <CalendarTodayIcon /> {/* Icona Calendario */}
              </ListItemIcon>
              <ListItemText primary="Calendario" />
            </ListItem>
            <ListItem button component={Link} to="/profile" onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
              <ListItemIcon sx={{ color: '#fff' }}>
                <PersonIcon /> {/* Icona Profilo */}
              </ListItemIcon>
              <ListItemText primary="Profilo" />
            </ListItem>
          </>
        )}
        {user && user.role === 'senior' && (
  <>
    <ListItem button component={Link} to="/senior" onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
      <ListItemIcon sx={{ color: '#fff' }}>
        <HomeIcon /> {/* Icona Home */}
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>
    
    <ListItem button component={Link} to="/calendar" onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
      <ListItemIcon sx={{ color: '#fff' }}>
        <CalendarTodayIcon /> {/* Icona Calendario */}
      </ListItemIcon>
      <ListItemText primary="Calendario" />
    </ListItem>
    <ListItem button component={Link} to="/richieste" onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
      <ListItemIcon sx={{ color: '#fff' }}>
        <GroupIcon /> {/* Icona Team */}
      </ListItemIcon>
      <ListItemText primary="Richieste" />
    </ListItem>
    
    <ListItem button component={Link} to="/profile" onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
      <ListItemIcon sx={{ color: '#fff' }}>
        <PersonIcon /> {/* Icona Profilo */}
      </ListItemIcon>
      <ListItemText primary="Profilo" />
    </ListItem>
    
    <ListItem button component={Link} to="/team" onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
      <ListItemIcon sx={{ color: '#fff' }}>
        <GroupIcon /> {/* Icona Team */}
      </ListItemIcon>
      <ListItemText primary="Team" />
    </ListItem>
  </>
)}

        {!user && (
          <>
            <ListItem button component={Link} to="/" onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
              <ListItemIcon sx={{ color: '#fff' }}>
                <HomeIcon /> {/* Icona Home */}
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/register" onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
              <ListItemIcon sx={{ color: '#fff' }}>
                <PersonAddIcon /> {/* Icona Registrati */}
              </ListItemIcon>
              <ListItemText primary="Registrati" />
            </ListItem>
            <ListItem button component={Link} to="/accedi" onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
              <ListItemIcon sx={{ color: '#fff' }}>
                <LoginIcon /> {/* Icona Accedi */}
              </ListItemIcon>
              <ListItemText primary="Accedi" />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <Router>
      <>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ ml: 2, mt: 2 }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="left"
          open={open}
          onClose={toggleDrawer(false)}
          sx={{
            width: 240, 
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240, 
              backgroundColor: ' rgb(0, 36, 96)', 
              color: '#fff', 
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
        <div style={{ marginLeft: open ? 240 : 0, transition: 'margin 0.3s' }}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/register" element={<Registrazione />} />
            <Route path="/accedi" element={<Access />} />

            <Route path="/junior" element={<Junior />} />
            <Route path="/senior" element={<Senior />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/viewcalendar" element={<ViewCallendar />} />
            <Route path="/contatta" element={<Contatta />} />
            <Route path="/profile" element={<Profilo />} />
            <Route path="/team" element={<Team />} />
            <Route path="/richieste" element={<Richiesta />} />
          </Routes>
        </div>
      </>
    </Router>
  );
}

export default Routing;
