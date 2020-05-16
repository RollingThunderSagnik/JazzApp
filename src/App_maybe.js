import React from 'react';
import logo, { ReactComponent } from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';

function App() {
  var tile = 64; 
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
      if(servedMessages.length > 5)
        servedMessages.splice(0,1);
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

  class Character extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        name: this.props.name,
        x : this.props.x,
        y : this.props.y,
        id : this.props.id
      };
    }
    
    render(){
      let charStyle = {
        left: this.state.x*tile + 'px',
        top: this.state.y*tile + 'px'
      };
      if(this.state.id == "userChar")
        return(
          <div className="character" style={charStyle} id="user">

          </div>
        );
      return(
          <div className="character" style={charStyle} >

          </div>
      );
    }
  }

  var players = [{
    name : 'acp',
    x : 0,
    y : 0,
    id : 'main'
  },
  {
    name : 'jagori',
    x : 1,
    y : 0,
    id : 'not_main'
  }
  ];
  var sokcet_id='main';

  function gameKeyPress(e){
    for(var i=0;i<players.length;i++)
    {
      if(players[i].id == sokcet_id)
        console.log(++players[i].x); 
    }
    var karz = players.map( (player) => <Character name={player.name} x={player.x} y={player.y} />);
    ReactDOM.render(
      <div>{karz}</div>,
      document.getElementById('gameBox')
    );
  }

  class GameBox extends React.Component {
    constructor(props){
      super(props);
      this.keyPress = this.keyPress.bind(this);
    }

    keyPress(e){
      gameKeyPress(e);
      //alert("kira");
    }

    render(){
      var karz = players.map( (player) => <Character name={player.name} x={player.x} y={player.y} />);
      return(
        <div id="gameBox" onClick={this.keyPress} tabIndex="0">
          {karz}
        </div>
      );
    }
  }
  return (
  <div>
    <GameBox />
    <Chat name="haha"/>
  </div>
  
  );
}

export default App;


