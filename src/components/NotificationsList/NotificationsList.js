import React, { Component } from 'react';
import '../../api';
import './NotificationsList.css';
import Notification from '../Notification/Notification';

import {
    CSSTransition,
    TransitionGroup
} from 'react-transition-group';

class NotificationsList extends Component {
    constructor(props) {
        super(props);

        this.showHideList = this.showHideList.bind(this);
        this.startNotificationExpireTimeout = this.startNotificationExpireTimeout.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleOutsidePopupClick = this.handleOutsidePopupClick.bind(this);
        this.handleEscPress = this.handleEscPress.bind(this);
    }

    state = {
        notifications: [],
        notificationsCount: 0,
        listIsVisible: undefined,
        startedTimeouts: []
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsidePopupClick);
        document.addEventListener('keydown', this.handleEscPress);
        const socket = new WebSocket('ws://127.0.0.1:8888');

        socket.onmessage = e => {
            const newNotification = JSON.parse(e.data);

            console.log(newNotification);

            if (newNotification.type !== 'remove-notification') {
                this.setState(prevState => {
                    let notifications = [...prevState.notifications];
                    let notificationsCount = prevState.notificationsCount;
                    let indexOfNotification = notifications.findIndex(el => el.id === newNotification.id);

                    // The notification is old and we update it
                    if (indexOfNotification !== -1) {
                        notifications[indexOfNotification] = Object.assign(notifications[indexOfNotification], newNotification);
                    } else { // The notification is new and we add it
                        notifications.unshift(newNotification);
                        notificationsCount = newNotification.type !== 'bonus' ? notificationsCount + 1 : notificationsCount;
                    }

                    return { notifications, notificationsCount };
                }, () => {
                    let alreadyStartedTimeoutIndex = this.state.startedTimeouts.findIndex(el => el.id === newNotification.id);

                    if (newNotification.expires) {
                        if (alreadyStartedTimeoutIndex !== -1) {
                            clearTimeout(this.state.startedTimeouts[alreadyStartedTimeoutIndex].timeout);
                            // We remove the started timeout from the array of started timeouts and start new timeout after that
                            this.setState(prevState => ({ startedTimeouts: prevState.startedTimeouts.filter(el => el.id !== newNotification.id) }), () => {
                                this.startNotificationExpireTimeout(newNotification);
                            });
                        } else {
                            this.startNotificationExpireTimeout(newNotification);
                        }
                    } else {
                        if (alreadyStartedTimeoutIndex !== -1) {
                            clearTimeout(this.state.startedTimeouts[alreadyStartedTimeoutIndex].timeout);
                            this.setState(prevState => ({ startedTimeouts: prevState.startedTimeouts.filter(el => el.id !== newNotification.id) }));
                        }
                    }
                });
            } else {
                this.setState(prevState => {
                    let alreadyStartedTimeoutIndex = prevState.startedTimeouts.findIndex(el => el.id === newNotification.id);
                    let startedTimeouts = prevState.startedTimeouts;
                    let notificationsCount = prevState.notificationsCount;
                    let notifications = prevState.notifications.filter(el => {
                        if (el.id === newNotification.id) {
                            el.type !== 'bonus' && notificationsCount--;
                            return false;
                        }
                        return true;
                    });

                    if (alreadyStartedTimeoutIndex !== -1) {
                        clearTimeout(prevState.startedTimeouts[alreadyStartedTimeoutIndex].timeout);
                        startedTimeouts = prevState.startedTimeouts.filter(el => el.id !== newNotification.id);
                    }

                    return { notifications, notificationsCount, startedTimeouts };
                });
            }
        };
    }


    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsidePopupClick);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    showHideList() {
        this.setState(prevState => ({ listIsVisible: !prevState.listIsVisible }));
    }

    handleOutsidePopupClick(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target) && this.state.listIsVisible) {
            this.setState({ listIsVisible: false });
        }
    }

    handleEscPress(event) {
        if (event.key === 'Escape' && this.state.listIsVisible) {
            this.setState({ listIsVisible: false });
        }
    }

    startNotificationExpireTimeout(newNotification) {
        let newTimeout = setTimeout(idToRemove => {
            this.setState(prevState => {
                let notificationsCount = prevState.notificationsCount;
                let notifications = prevState.notifications.filter(el => {
                    if (el.id === idToRemove) {
                        el.type !== 'bonus' && notificationsCount--;
                        return false;
                    }
                    return true;
                });
                return {
                    notifications,
                    startedTimeouts: prevState.startedTimeouts.filter(el => el.id !== idToRemove),
                    notificationsCount
                }
            });
        }, newNotification.expires, newNotification.id);

        this.setState(prevState => {
            let startedTimeouts = [...prevState.startedTimeouts];
            startedTimeouts.push({
                id: newNotification.id,
                timeout: newTimeout
            });

            return { startedTimeouts };
        });
    }

    getNotificationsList() {
        if (this.state.notifications.length === 0) {
            return (
                <TransitionGroup>
                    <CSSTransition timeout={0} classNames="animated-no-notifications">
                        <div className="no-notifications">There are no notifications!</div>
                    </CSSTransition>
                </TransitionGroup>
            )
        }

        return (
            <TransitionGroup>
                {
                    this.state.notifications.map(el =>
                        <CSSTransition key={el.id} timeout={1000} classNames="animated-notification">
                            <Notification key={el.id} data={el} />
                        </CSSTransition>
                    )
                }
            </TransitionGroup>
        );
    }

    render() {
        console.log('NOTIFICATIONS');
        console.log(this.state.notifications);
        let notificationsCountText = this.state.notificationsCount.toString();
        let notificationsCountClass = 'notifications-count';

        if (this.state.notificationsCount > 99) {
            notificationsCountText = '99+';
            notificationsCountClass += ' font-13';
        }

        return (
            <div className="notifications" ref={this.setWrapperRef}>
                <div className="notifications-icon" onClick={this.showHideList}>
                    <i className="fas fa-bell bell-icon"></i>
                    {this.state.notificationsCount > 0 && <div className={notificationsCountClass}>{notificationsCountText}</div>}
                </div>
                {
                    this.state.listIsVisible !== undefined &&
                    <div className={this.state.listIsVisible ? 'notifications-list-popup' : 'notifications-list-popup-closed'}>
                        <div className="arrow-up"></div>
                        <div className="notifications-list-title">Notifications</div>
                        <div className="notifications-list">
                            {this.getNotificationsList()}
                        </div>
                    </div>
                }
            </div >
        );
    }
}

export default NotificationsList;