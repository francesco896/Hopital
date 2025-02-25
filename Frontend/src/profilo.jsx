import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Avatar, Grid, Box, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { useUser } from './userContext';
import Cookies from 'js-cookie'; 

const Profilo = () => {
  const { user, setUser, logout } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('token');  
        if (!token) {
          setError('Token non trovato');
          setLoading(false);
          return;
        }

        const risposta = await axios.get('http://localhost:5001/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`  
          }
        });
        setUser(risposta.data); 
      } catch (error) {
        console.error('Errore durante il recupero del profilo:', error);
        setError('Non è stato possibile caricare il profilo');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [setUser]);

  const handleLogout = () => {
    logout();
    Cookies.remove('token');  
    navigate('/');  
  };

  if (loading) return <Typography>Caricamento...</Typography>;
  if (error) return <Typography>Errore: {error}</Typography>;

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ bgcolor: 'secondary.main', width: 100, height: 100 }}>
            {user.firstName[0]}
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ marginTop: 2 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user.email}
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12}>
              <Typography variant="body1">Nome: {user.firstName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Cognome: {user.lastName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Email: {user.email}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Ruolo: Operatore {user.role}</Typography>
            </Grid>
          </Grid>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLogout}
            sx={{ marginTop: 3 }}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profilo;
