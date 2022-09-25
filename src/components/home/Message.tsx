import React from "react";
import {Card} from 'react-bootstrap';

export const Message = (props: {user: any, content: string}) => {
    return (
        <Card>
            <Card.Header>{props.user.firstName}</Card.Header>
            <Card.Body>{props.content}</Card.Body>
        </Card>
    );
}