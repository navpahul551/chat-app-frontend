import axios from "axios";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Anchor, Button, Modal, Form } from "react-bootstrap";
import { Login } from "../login/Login";
import './Home.css';
import { Message } from './Message';
import { API_URL } from "../../Constants";

interface IGroup {
    id: number,
    name: string,
    user?: any
}

interface IMessage {
    user: any,
    group?: any,
    content: string,
    id?: number
}

interface IMessages extends Array<IMessage> { }

const fetchGroups = async (userId: number) => {
    const currentUser = JSON.parse(localStorage.getItem('CURRENT_USER')?.toString() || '');
    const token = `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`;

    return axios({
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        url: `${API_URL}/users/${currentUser.id}/groups`
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        alert(err.response.data);
    });
}

const fetchMessages = async (groupId: number) => {
    const token = `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`;
    return axios({
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        url: `${API_URL}/groups/${groupId}/messages`
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        alert(err.response.data);
    });
};

const sendMessage = async (content: string, groupId: number) => {
    const token = `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`;

    return axios({
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        url: `${API_URL}/groups/${groupId}/messages`,
        data: {
            groupId: groupId,
            content: content
        }
    });
};

const sendGroupInvite = async (groupId: number, email: string) => {
    return axios({
        method: 'post',
        url: `${API_URL}/groups/${groupId}/send-invite`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        },
        data: {
            recipient: email
        }
    }).then(response => {
        alert('Invite sent successfully!');
        return response.data;
    }).catch(err => {
        alert(`Error ${err.response.status}: ${err.response.data}`);
    });
};

const sendAddGroupRequest = async (groupName: string) => {
    return axios({
        method: 'post',
        url: `${API_URL}/groups`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        },
        data: {
            groupName
        }
    }).then(response => {
        alert(response.data);
        window.location.reload();
    }).catch(err => {
        alert(`Error ${err.response.status}: ${err.response.data}`);
    });
}

const sendExitGroupRequest = async (groupId: number) => {
    const currentUser = JSON.parse(localStorage.getItem('CURRENT_USER')?.toString() || '');

    return axios({
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        },
        url: `${API_URL}/users/${currentUser.id}/groups/${groupId}/exit`
    }).then((response) => {
        alert(response.data);
        window.location.reload();
    }).catch((err) => {
        alert(err.response.data);
    });
}

export const Home = () => {
    const [messages, setMessages] = useState<any>([]);
    const [groups, setGroups] = useState<any>([]);
    const [selectedGroupId, setSelectedGroup] = useState<number>(0);
    const [newMessage, setNewMessage] = useState<string>('');
    const [showSendInviteModal, setShowSendInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [newGroupName, setNewGroupName] = useState('');
    const [showAddGroupModal, setShowAddGroupModal] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('CURRENT_USER')?.toString() || '');


    useEffect(() => {
        fetchGroups(currentUser.id).then((response) => {
            setGroups(response);
            if (response === undefined || response.length === 0) return;
            setSelectedGroup(response[0].id);

            fetchMessages(response[0].id).then(msgResponse => {
                setMessages(msgResponse);
            });
        });
    }, []);



    const handleModalClose = () => setShowSendInviteModal(false);
    const handleModalShow = () => setShowSendInviteModal(true);

    const handleSendInvite = async (event: any) => {
        sendGroupInvite(selectedGroupId, inviteEmail).then(response => {
            setShowSendInviteModal(false);
        });
    }

    const handleGroupClick = (event: any) => {
        const groupId = event.target.getAttribute('data-group-id');

        fetchMessages(groupId).then(response => {
            setMessages(response);
            setSelectedGroup(groupId);
        });
    };

    const handleSendMessage = async (event: any) => {
        if (newMessage === '') return;

        await sendMessage(newMessage, selectedGroupId).then(response => {
            setNewMessage('');
        });

        fetchMessages(selectedGroupId).then(response => {
            setMessages(response);
        });
    };

    const handleAddGroup = async (event: any) => {
        if(newGroupName === '') {
            alert('Please enter a group name!');
            return;
        }

        await sendAddGroupRequest(newGroupName);
    };

    const handleHideAddGroupModal = () => setShowAddGroupModal(false);

    const handleExitGroup = (event: any) => {
        if(window.confirm("Are you sure?")){
            sendExitGroupRequest(selectedGroupId);
        }
    };

    if (localStorage.getItem('ACCESS_TOKEN') === null) {
        return <>Please login to continue!</>;
    }
    else {
        return (
            <Container className="container-custom">
                <Row>
                    {/* Groups */}
                    <Col xs={3}>
                        <Card>
                            <Card.Header>
                                <h5 className="text-center">Groups</h5>
                                <Button className="float-start" type="button" variant="primary" onClick={() => {
                                    setShowAddGroupModal(true);
                                }}>Add</Button>
                            </Card.Header>
                            <Card.Body>
                                {
                                    groups === undefined ? 'No groups found!' : groups.map((group: IGroup, index: number) => {
                                        return (
                                            <div key={"div-" + index} className="groupDiv">
                                                <Anchor className="groupAnchor" href="#" key={"group-" + group.id} data-group-id={group.id} onClick={handleGroupClick}>
                                                    {group.name}
                                                </Anchor>
                                            </div>
                                        );
                                    })
                                }
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Messages */}
                    <Col xs={9}>
                        <Card>
                            <Card.Header>
                                <h5 className="text-center">Messages</h5>
                                <Button variant="warning" onClick={handleModalShow}>
                                    Invite
                                </Button>
                                
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                
                                <Button variant="danger" onClick={handleExitGroup} type="button">
                                    Exit Group
                                </Button>
                            </Card.Header>

                            <Card.Body>
                                <div style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
                                    {messages.length === 0 ? 'No messages found!' : messages.map((msg: IMessage, index: number) => {
                                        if (msg.user.email === currentUser.email) {
                                            return (
                                                <Row key={'message-row-' + msg.id} className="text-end messageRow">
                                                    <Col key={'message-col-1-' + msg.id} xs={6}></Col>
                                                    <Col key={'message-col-2-' + msg.id} xs={6}>
                                                        <Message key={'message-' + msg.id} user={msg.user} content={msg.content} />
                                                    </Col>
                                                </Row>
                                            );
                                        }
                                        else {
                                            return (
                                                <Row key={'message-row-' + msg.id} className="messageRow">
                                                    <Col key={'message-col-1-' + msg.id} xs={6}>
                                                        <Message key={'message-' + msg.id} user={msg.user} content={msg.content} />
                                                    </Col>
                                                    <Col key={'message-col-2-' + msg.id} xs={6}></Col>
                                                </Row>
                                            );
                                        }
                                    })}
                                </div>

                                <br /><br />
                                <div className="input-group">
                                    <input type="text" className="form-control" value={newMessage} onChange={({ target }) => {
                                        setNewMessage(target.value);
                                    }} />
                                    <Button variant="primary" type="button" onClick={handleSendMessage}>Send</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/*Modal for sending email invites*/}
                <Modal show={showSendInviteModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Send Invite</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <label>Email</label>
                            <input type="email" className="form-control" value={inviteEmail} onChange={({ target }) => {
                                setInviteEmail(target.value);
                            }} />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSendInvite}>
                            Send
                        </Button>
                    </Modal.Footer>
                </Modal>

                 {/*add group modal*/}
                 <Modal show={showAddGroupModal} onHide={handleHideAddGroupModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <label>Group name</label>
                            <input type="email" className="form-control" value={newGroupName} onChange={({ target }) => {
                                setNewGroupName(target.value);
                            }} />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleHideAddGroupModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAddGroup}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
};