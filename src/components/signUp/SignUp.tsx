import axios from "axios";
import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Constants";

interface IUser {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}

const sendSignUpRequest = async (userDetails: IUser) => {
    return axios({
        method: 'POST',
        url: `${API_URL}/users/sign-up`,
        data: userDetails
    }).then(response => {
        alert('User signed up successfully!');
    }).catch(err => {
        alert(`Error ${err.response.status}: ${err.response.data}`);
    });
}

const SignUp = () => {
    const [user, setUser] = useState<IUser>({ email: '', password: '', firstName: '', lastName: '' });

    const handleSignUpRequest = async (event: any) => {
        event.preventDefault();
        await sendSignUpRequest(user);
        return false;
    };

    return (
        <div>
            <Card style={{ margin: 100 }}>
                <Card.Header>
                    Sign Up
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSignUpRequest}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="e.g. test@example.com" value={user.email} onChange={({ target }) => {
                                setUser({ email: target.value, password: user.password, firstName: user.firstName, lastName: user.lastName });
                            }} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="e.g. Password@Aa123" value={user.password} onChange={({ target }) => {
                                setUser({ email: user.email, password: target.value, firstName: user.firstName, lastName: user.lastName });
                            }} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Firstname</Form.Label>
                            <Form.Control type="text" placeholder="e.g. John" value={user.firstName} onChange={({ target }) => {
                                setUser({ password: user.password, firstName: target.value, lastName: user.lastName, email: user.email });
                            }} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Lastname</Form.Label>
                            <Form.Control type="text" placeholder="e.g. Wick" value={user.lastName} onChange={({ target }) => {
                                setUser({ password: user.password, firstName: user.firstName, lastName: target.value, email: user.email });
                            }} />
                        </Form.Group>
                            <br/>
                        <Button variant="primary" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default SignUp;