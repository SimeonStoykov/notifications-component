import React, { Component } from 'react';
import './api';
import './App.css';

class App extends Component {
  componentDidMount() {
    const socket = new WebSocket('ws://127.0.0.1:8888');

    socket.onmessage = e => {
      const msg = JSON.parse(e.data);
    
      console.log(msg);
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          
        </header>
      </div>
    );
  }
}

export default App;
