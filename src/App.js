import React from 'react';
import logo, { ReactComponent } from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';

function App() {

  class Messages extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        messages : this.props.messages
      }
    }
    render(){
      var msgz = this.state.messages.map( (msg) => <li>{msg}</li>);
      return (
          <ul id="messages">
            {msgz}
          </ul>
      );
    }
  }
  
  var servedMessages = [];
  function SendMessage(str){
      servedMessages.push(str);
      ReactDOM.render(
        // <React.StrictMode>
        <Messages messages={servedMessages}/>,
        // </React.StrictMode>,
        document.getElementById('messageHolder')
      );
  }

  class Chat extends React.Component {
    constructor(props){
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.keyPress = this.keyPress.bind(this);
      this.state = {
        name : this.props.name,
        currentmsg : ''
      }
    }

    keyPress(e){
      if(e.keyCode == 13)
       {
        SendMessage(this.state.name + ": "+ this.state.currentmsg);
        e.target.value = '';
       }
    }

    handleChange(e) {
      this.state.currentmsg = e.target.value;
    }

    render(){
     // var msgz = this.state.messages.map( (msg) => <li>{msg}</li>);
      return (
        <div id="chat">
          <div id="messageHolder">
            <Messages messages={servedMessages}/>
          </div>
          <div id="typehold">
            <input type="text" onChange={this.handleChange} onKeyDown={this.keyPress} placeholder="enter a message..."></input>
          </div>
        </div>
      );
    }
  }

  return <Chat name="haha"/>
}

export default App;


