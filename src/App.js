import React, { Component } from 'react';
import './App.css';
import NotificationsList from './components/NotificationsList/NotificationsList';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <header className="app-header">
          <div className="app-title">Notifications Component</div>
          <NotificationsList />
        </header>
        <div className="page-content"></div>
      </React.Fragment>
    );
  }
}

export default App;
