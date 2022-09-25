import axios from 'axios';
import React, { useState } from 'react';
import { Button, Container, Modal, Nav, Navbar } from 'react-bootstrap';
import './Navbar.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { API_URL } from '../../Constants';
import GroupInvite from '../groupInvite/GroupInvite';

interface IInvite{
    id: number,
    sender: any,
    group: any,
    receiverEmail: string,
    active: boolean,
    accepted: boolean
}

interface IInvites extends Array<IInvite> { }

const fetchGroupInvites = async () => {
    const currentUser = JSON.parse(localStorage.getItem('CURRENT_USER')?.toString() || '');
    const token = `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`;

    return axios({
        method: 'get',
        url: `${API_URL}/users/${currentUser.id}/group-invites`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }).then(response => {
        return response.data;
    }).catch(err => {
        alert(`Error ${err.response.status}: ${err.response.data}`);
        return null;
    });
}

export default function NavBar() {
    const isAuthenticated = localStorage.getItem('ACCESS_TOKEN') !== null;
    const navigate = useNavigate();
    const [showInvitesModal, setShowIvitesModal] = useState(false);
    const [groupInvites, setGroupInvites] = useState<IInvites>();

    const homeLink = isAuthenticated && <Nav.Link className="navItem" href="/">Home</Nav.Link>;
    const loginLink = !isAuthenticated && <Nav.Link className="navItem" href="/login">Login</Nav.Link>;
    const registerLink = !isAuthenticated && <Nav.Link className="navItem" href="/sign-up">Sign up</Nav.Link>;
    const logoutLink = isAuthenticated && <Nav.Link className="navItem" href="#" onClick={() => {
        localStorage.removeItem('ACCESS_TOKEN');
        navigate("/login");
    }}>Logout</Nav.Link>;
    const invitesLink = isAuthenticated && <Nav.Link className="navItem" href="#" onClick={async () => {
        fetchGroupInvites().then(response => {
            if (response !== null) {
                setGroupInvites(response);
                setShowIvitesModal(true);
            }
        });
    }}>Invites</Nav.Link>;

    const handleInvitesModalClose = () => {
        setShowIvitesModal(false);
    };

    return (
        <>
            <Navbar collapseOnSelect fixed='top' expand='sm' className="sticky-nav">
                <Container>
                    <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                    <Navbar.Collapse id='responsive-navbar-nav'>
                        <Nav className="ms-auto">
                            {homeLink}
                            {invitesLink}
                            {loginLink}
                            {registerLink}
                            {logoutLink}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/*Modal for sending email invites*/}
            <Modal show={showInvitesModal} onHide={handleInvitesModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Group Invites</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {groupInvites === undefined ? '' : groupInvites.map((invite: IInvite, index: number) => {
                        return (
                            <GroupInvite key={"group-invite-" + index} invite={invite} />
                        );
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleInvitesModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}