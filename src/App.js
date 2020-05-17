import React from 'react';
import logo, { ReactComponent } from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
const socket = socketIOClient(ENDPOINT);



socket.on('connect', () => {
  const userUnikID = "user_" + socket.id;
  console.log(userUnikID); // true
});



function App() {
  var tile = 64; 

  class Messages extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        messages : this.props.messages
      }
    }

    componentDidMount(){
      document.addEventListener('gandu',  (event) => {
        this.setState({
          messages : event.detail.barta
        });
      });
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

  socket.on("receivemessage", (messages) => {
    //console.log("peyechi ekta message");
    document.dispatchEvent(new CustomEvent("gandu", {
      detail: { barta : messages }
    }));
  });

  class Chat extends React.Component {
    constructor(props){
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.keyPress = this.keyPress.bind(this);
      this.state = {
        name : this.props.name,
        messages : [],
        currentmsg : ''
      }
      console.log("name is: "+this.props.name);
    }

    keyPress(e){
      if(e.keyCode == 13)
       {
        socket.emit('sendmessage',this.state.name,this.state.currentmsg);
        e.target.value = '';
       }
    }

    handleChange(e) {
      this.state.currentmsg = e.target.value;
    }

    render(){
      return (
        <div id="chat">
            <Messages messages={this.state.messages}/>
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
      this.state.charStyle = {
          left: this.props.x*tile + 'px',
          top: this.props.y*tile + 'px'
        }
    }

    componentDidUpdate(prevProps) {
      if (this.props.x !== prevProps.x || this.props.y !== prevProps.y) {
        this.setState({ 
          x : this.props.x,
          y : this.props.y,
          charStyle : {
            left: this.props.x*tile + 'px',
            top: this.props.y*tile + 'px'
          }
        });
      }
    }
    
    render(){
      
      if(this.state.id == "userChar")
        return(
          <div className="character" style={this.state.charStyle} id="user">
            <p>{this.state.name.toUpperCase()}</p>
          </div>
        );
      return(
          <div className="character" style={this.state.charStyle} >
            <p>{this.state.name.toUpperCase()}</p>
          </div>
      );
    }
  }
  
  
  const userPlayer = {
    name : prompt("Please enter your name", "Harry Potter"),
    x : 0,
    y : 0
  };

  console.log(userPlayer.name);
  socket.emit("addplayer",userPlayer);
  // function newPlayer(name, x, y, id)
  // {

  // }

  socket.on("changedPlayerPositions", (newPositions) => {
    console.log(newPositions);
    document.dispatchEvent(new CustomEvent("updatePos", {
      detail: { positions : newPositions }
    }));
  });
  class GameBox extends React.Component {
    constructor(props){
      super(props);
      this.keyPress = this.keyPress.bind(this);
      this.state = {
        players : this.props.players
      };
    }

    componentDidMount(){
      document.addEventListener('updatePos',  (event) => {
        this.setState({
          players : event.detail.positions
        });
        // console.log(event.detail.positions);
      });
    }

    keyPress(e){
      var playersChanged = this.state.players;
      for(var i=0;i<playersChanged.length;i++)
      {
        if(playersChanged[i].name == userPlayer.name)
        {
            if(e.keyCode == 39)
              playersChanged[i].x =playersChanged[i].x+1;

            if(e.keyCode == 37)
            playersChanged[i].x =playersChanged[i].x-1;

            if(e.keyCode == 38)
            playersChanged[i].y =playersChanged[i].y-1;

            if(e.keyCode == 40)
            playersChanged[i].y =playersChanged[i].y+1;
        }
      }     
      socket.emit("changePlayerPositions",playersChanged);
    }

    render(){
      var karz = this.state.players.map( (player) => <Character id={player.id} name={player.name} x={player.x} y={player.y} />);
      return(
        <div id="gameBox" onKeyDown={this.keyPress} tabIndex="0">
          {karz}
        </div>
      );
    }
  } 
  return (
  <div>
    <GameBox players={[]}/>
    <Chat name={userPlayer.name}/>
  </div>
  
  );
}

export default App;


