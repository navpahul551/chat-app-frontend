import React, { useCallback, useState } from 'react';
import './Login.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../Constants';

interface IUser {
  email: string,
  password: string
}

const sendLoginRequest = async (user: IUser) => {
  return axios({
      method: 'post',
      url: `${API_URL}/users/login`,
      data: user
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      alert('An error occurred while loggin in the user');
    });
}

export const Login = () => {
  const [user, setUser] = useState<IUser>({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = useCallback((event : any) => {
    event.preventDefault();
    sendLoginRequest(user).then(response => {
      localStorage.setItem('ACCESS_TOKEN', response['token']);
      localStorage.setItem('CURRENT_USER', JSON.stringify(response['user']));
      navigate('/');
    });    
  }, [user]);

  return (
    <div className="Login">
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={user.email} onChange={({target}) => {
                setUser({email: target.value, password: user.password});
              }}/>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={user.password} onChange={({target}) => {
                setUser({email: user.email, password: target.value});
              }}/>
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
