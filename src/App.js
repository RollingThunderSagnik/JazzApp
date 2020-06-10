import React from 'react';
import logo, { ReactComponent } from './logo.svg';
import './App.css';
import './welcome_screen.css';
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
const socket = socketIOClient(ENDPOINT);



socket.on('connect', () => {
  const userUnikID = "user_" + socket.id;
  console.log(userUnikID); // true
});



function App() {
  var tile = 40; 


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
        id : this.props.id,
        fLeft : this.props.fLeft,
        avatar : this.props.avatar
      };
      this.state.charStyle = {
        left: this.props.x*tile + 'px',
        top: this.props.y*tile + 'px',
        zIndex: this.props.y,
        transform : 'scaleX('+ this.props.fLeft +')'
      }
    }

    componentDidUpdate(prevProps) {
     // if (this.props.x !== prevProps.x || this.props.y !== prevProps.y) {
       
      if (this.props !== prevProps) {
        this.setState({ 
          name: this.props.name,
          x : this.props.x,
          y : this.props.y,
          fLeft : this.props.fLeft,
          avatar : this.props.avatar,
          charStyle : {
            left: this.props.x*tile + 'px',
            top: this.props.y*tile + 'px',
            zIndex: this.props.y
          }
        });
      }
    }
    
    render(){
      var clasist = "character";
      if(this.state.fLeft == -1)
        clasist += " fleft";
      
      switch(this.state.avatar)
      {
        case 0: clasist += " doomer"; break;
        case 1: clasist += " bhakt"; break;
        case 2: clasist += " moist"; break;
        case 3: clasist += " ladis"; break;
        case 4: clasist += " nerd"; break;
        case 5: clasist += " lib"; break; 
      }
      

      return(
          <div className={clasist} style={this.state.charStyle} >
            <p><b>{this.state.name}</b></p>
          </div>
      );
    }
  }
  
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
      var i;
      for(i=0;i<playersChanged.length;i++)
      {
        if(playersChanged[i].name == userPlayer.name)
        { break;}
      }

      if(e.keyCode == 39)
      { 
        if(playersChanged[i].fLeft == 1)
          { playersChanged[i].x = playersChanged[i].x+1;}
        playersChanged[i].fLeft = 1;
      }

      if(e.keyCode == 37)
      {
        if(playersChanged[i].fLeft == -1)
          { playersChanged[i].x = playersChanged[i].x-1;}
        playersChanged[i].fLeft = -1;
      }

      if(e.keyCode == 38)
      playersChanged[i].y =playersChanged[i].y-1;

      if(e.keyCode == 40)
      playersChanged[i].y =playersChanged[i].y+1;

      
      socket.emit("changePlayerPositions",playersChanged);
    }

    render(){
      var karz = this.state.players.map( (player) => <Character id={player.id} avatar={player.avatar} name={player.name} x={player.x} y={player.y} fLeft={player.fLeft} />);
      return(
        <div id="gameBox" onKeyDown={this.keyPress} tabIndex="0">
          {karz}
        </div>
      );
    }
  } 


  socket.on("receivemessage", (messages) => {
    //console.log("peyechi ekta message");
    document.dispatchEvent(new CustomEvent("gandu", {
      detail: { barta : messages }
    }));
  });

  socket.on("changedPlayerPositions", (newPositions) => {
    console.log(newPositions);
    document.dispatchEvent(new CustomEvent("updatePos", {
      detail: { positions : newPositions }
    }));
  });
  /*

  console.log(userPlayer.name);
  socket.emit("addplayer",userPlayer);

 


  return (
  <div>
    <GameBox players={[]}/>
    <Chat name={userPlayer.name}/>
  </div>
  
  );
*/
  var userPlayer = {
    name : "foo",
    x : 0,
    y : 0
  };

  class PlayerSelection extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        name : "TERE_NAAM",
        availability : false,
        type : 0
      }
      this.handleChange = this.handleChange.bind(this);
      this.checkVal = this.checkVal.bind(this);
      this.playerFixed = this.playerFixed.bind(this);
      this.setAvatar = this.setAvatar.bind(this);
    }

    handleChange(e) {
      this.setState({
        name : ((e.target.value == '') ? 'TERE_NAAM' : e.target.value)
      });
      socket.emit("checkplayer", e.target.value);
    }

    componentDidMount(){
      socket.on("playerReadyToAdd", (x) => {
        if(x<0)
          this.setState({
            availability : true
          });
        else
          this.setState({
            availability : false
          });
      });
    }

    checkVal(e){
      var x = e.keyCode;
      if((x<65 || x>90) && (x<97 || x>122) && x!=8 && (x<37 || x>40) && x!=46)
       e.preventDefault();
    }

    playerFixed(){
      if(this.state.availability)
        {
          userPlayer = {
            name : this.state.name,
            x : 0,
            y : 0,
            fLeft : 1,
            avatar : this.state.type
          };
          socket.emit("addplayer",userPlayer);

          
          ReactDOM.render(
          <div>
            <GameBox players={[]}/>
            <Chat name={userPlayer.name}/>
          </div>,
            document.getElementById('root')
          );
        }
    }

    setAvatar(){
      this.setState({
        type : (this.state.type + 1)%6
      });
      console.log(this.state.type);
    }

    render()
    {
      return (
      <div id="choosePlayer">
        <div id="cha">
          <Character x={0} avatar={this.state.type} fLeft={1} name={this.state.name}/>
        </div>
        <div id='details'>
          <div>
          
            <div id='namoagain' className={(this.state.availability ? '' : 'fuckd')}>
              enter your name:
              <input type="text" maxlength="10" onChange={this.handleChange} onKeyDown={this.checkVal} placeholder="tere naam..."></input>
            </div>

            <hr />

            <button class='eightbit-btn eightbit-btn--proceed' onClick={this.setAvatar} >{'<< CHANGE AVATAR >>'}</button>
            
            <hr />
            
            <button class='eightbit-btn' onClick={this.playerFixed}>JOIN</button>
          </div>
        </div>
      </div>);
    }
  }

  return <PlayerSelection />;
}

export default App;


