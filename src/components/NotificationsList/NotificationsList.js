import React, { Component } from 'react';
import '../../api';

class NotificationsList extends Component {
    componentDidMount() {
        const socket = new WebSocket('ws://127.0.0.1:8888');

        socket.onmessage = e => {
            const msg = JSON.parse(e.data);

            console.log(msg);
        };
    }

    render() {
        return (
            <div>
               Icon
            </div>
        );
    }
}

export default NotificationsList;