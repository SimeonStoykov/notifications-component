import React, { Component } from 'react';
import './Notification.css';

export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.handlePromoNotificationCLick = this.handlePromoNotificationCLick.bind(this);
    }

    handlePromoNotificationCLick(link) {
        window.open(link);
    }

    render() {
        let notification = null;

        switch (this.props.data.type) {
            case 'text': {
                let { key, title, text } = this.props.data;
                notification =
                    <div key={key} className="notification-wrapper">
                        <h4 className="text-title">{title}</h4>
                        <p>{text}</p>
                    </div>;
            }
                break;
            case 'promotion': {
                let { title, image, link } = this.props.data;

                notification =
                    <div key={this.props.notificationIndex} className="notification-wrapper cursor-pointer" onClick={this.handlePromoNotificationCLick.bind(this, link)}>
                        <h4 className="text-title">{title}</h4>
                        <img src={image} alt="" title="Promotion" className="loading promo-img" />
                    </div>;
            }
                break;
            case 'bonus': {
                let { key, title, requirement } = this.props.data;
                notification =
                    <div key={key} className="notification-wrapper">
                        <h4 className="text-title">{title} - Bonus</h4>
                        <p>{requirement}</p>
                    </div>;
            }
                break;
            default:
                break;
        }

        return notification;
    }
}
