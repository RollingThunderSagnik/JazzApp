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
  function SendMessage(name,str){
      servedMessages.push(<p>{name + ': '}<i>{str}</i></p>);
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
        SendMessage(this.state.name,this.state.currentmsg);
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
      this.state.charStyle = {
          left: this.props.x*tile + 'px',
          top: this.props.y*tile + 'px'
        }
    }

    componentDidUpdate(prevProps) {
      // console.log(this.state);
      // console.log("vs");
      // console.log(this.props);
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

    // move(id){
    //   //if(this.state.id == id)
    //     this.setState({
    //       x : this.state.x
    //     });
    // }
    
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
  
  var playersIN = [{
    name : 'acp',
    x : 2,
    y : 0,
    id : 'main'
  },
  {
    name : 'daya',
    x : 1,
    y : 0,
    id : 'not_main'
  },
  
  // {
  //   name : '3',
  //   x : 3,
  //   y : 4,
  //   id : 'not_main'
  // },
  
  // {
  //   name : '4',
  //   x : 4,
  //   y : 4,
  //   id : 'not_main'
  // },
  
  {
    name : '5',
    x : 5,
    y : 4,
    id : 'not_main'
  }];

  class GameBox extends React.Component {
    constructor(props){
      super(props);
      this.keyPress = this.keyPress.bind(this);
      this.state = {
        players : this.props.players
      };
    }

    keyPress(e){
      var playersChanged = this.state.players;
      for(var i=0;i<playersChanged.length;i++)
      {
        if(playersChanged[i].id == 'main')
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
      this.setState({
        players : playersChanged
      });
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
    <GameBox players={playersIN}/>
    <Chat name="neshakhor raxit"/>
  </div>
  
  );
}

export default App;


