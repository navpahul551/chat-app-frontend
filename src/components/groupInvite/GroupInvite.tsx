import axios from "axios";
import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { API_URL } from "../../Constants";
import './GroupInvite.css';

interface IInvite {
    id: number,
    sender: any,
    group: any,
    receiverEmail: string,
    active: boolean,
    accepted: boolean
}

const sendAcceptInviteRequest = async (inviteId: number) => {
    const currentUser = JSON.parse(localStorage.getItem('CURRENT_USER')?.toString() || '');
    const token = `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`;

    return axios({
        method: 'PATCH',
        url: `${API_URL}/users/${currentUser.id}/group-invites/${inviteId}/accept`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }).then(response => {
        alert(response.data);
        window.location.reload();
    }).catch(err => {
        alert(`Error ${err.response.status}: ${err.response.data}`);
    });
}


const sendDeclineInviteRequest = async (inviteId: number) => {
    const currentUser = JSON.parse(localStorage.getItem('CURRENT_USER')?.toString() || '');
    const token = `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`;

    return axios({
        method: 'PATCH',
        url: `${API_URL}/users/${currentUser.id}/group-invites/${inviteId}/decline`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }).then(response => {
        alert(response.data);
        window.location.reload();
    }).catch(err => {
        alert(`Error ${err.response.status}: ${err.response.data}`);
    });
}

const sendDeletedInviteRequest = async (inviteId: number) => {
    const currentUser = JSON.parse(localStorage.getItem('CURRENT_USER')?.toString() || '');
    const token = `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`;

    return axios({
        method: 'DELETE',
        url: `${API_URL}/users/${currentUser.id}/group-invites/${inviteId}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }).then(response => {
        alert(response.data);
        window.location.reload();
    }).catch(err => {
        alert(`Error ${err.response.status}: ${err.response.data}`);
    });
}

const GroupInvite = (props: { invite: IInvite }) => {
    const currentUser = JSON.parse(localStorage.getItem('CURRENT_USER')?.toString() || '');

    const handleAcceptInvite = async (event: any) => {
        await sendAcceptInviteRequest(props.invite.id);
    }

    const handleDeclineInvite = async (event: any) => {
        await sendDeclineInviteRequest(props.invite.id);
    }

    const handleDeleteInvite = async (event: any) => {
        await sendDeletedInviteRequest(props.invite.id);
    }

    if (currentUser.email === props.invite.sender.email) {
        return (
            <div className="groupInviteDiv">
                <span style={{ fontStyle: 'italic' }}>Sent by you to <strong>{props.invite.receiverEmail}</strong></span>
                <br />
                <span>Active: {props.invite.active ? "true" : "false"}</span>

                {props.invite.accepted ?
                    <span className="float-end text-success" style={{ fontStyle: 'italic' }}>The invitation has been accepted</span> :
                    <Button className="float-end" type="button" variant="outline-danger" onClick={handleDeleteInvite}>Delete</Button>}
            </div>
        );
    }
    else {
        return (
            <div className="groupInviteDiv">
                <Row>
                    <Col xs={6}>
                        <span style={{ fontStyle: 'italic' }}>Sent by <strong>{props.invite.sender.firstName}</strong></span>
                        <br />
                        <span>Group: <strong>{props.invite.group.name}</strong></span>
                    </Col>

                    {!props.invite.active ? <Col><span className="text-danger float-end">Invitation declined!</span></Col> :
                        (props.invite.accepted ? <Col><span className="text-success">The invitation has been accepted</span></Col> :
                            <Col xs={6}>
                                <Button type="button" variant="outline-success" onClick={handleAcceptInvite}>
                                    Accept
                                </Button>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button type="button" variant="outline-danger" onClick={handleDeclineInvite}>
                                    Decline
                                </Button>
                            </Col>)
                    }
                </Row>
            </div>
        );
    }
};

export default GroupInvite;