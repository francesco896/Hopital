import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../userContext'; 

const CustomCard = ({ title, image, description, destinationUrl }) => {
  const navigate = useNavigate();
  const { user } = useUser();  

  const handleClick = () => {
    if (user) {
     
      navigate(destinationUrl);
    } else {
      
      navigate('/register');
      alert('Devi essere registrato per poter utilizzarlo');
    }
  };

  return (
    <Card sx={{ backgroundColor: '#00173d', color: 'white' }} 
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" >
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleClick}>
          VAI ALLA PAGINA
        </Button>
      </CardActions>
    </Card>
  );
};

export default CustomCard;