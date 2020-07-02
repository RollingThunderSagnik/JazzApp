import React from 'react';
import logo, { ReactComponent } from './logo.svg';
import './App.css';
import './welcome_screen.css';
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
const socket = socketIOClient(ENDPOINT);
// const socket = socketIOClient();


socket.on('connect', () => {
  const userUnikID = "user_" + socket.id;
  console.log(userUnikID); // true
});

var JoyStick = (function(container, parameters)
    {
      parameters = parameters || {};
      var title = (typeof parameters.title === "undefined" ? "joystick" : parameters.title),
        width = (typeof parameters.width === "undefined" ? 0 : parameters.width),
        height = (typeof parameters.height === "undefined" ? 0 : parameters.height),
        internalFillColor = (typeof parameters.internalFillColor === "undefined" ? "#00AA00" : parameters.internalFillColor),
        internalLineWidth = (typeof parameters.internalLineWidth === "undefined" ? 2 : parameters.internalLineWidth),
        internalStrokeColor = (typeof parameters.internalStrokeColor === "undefined" ? "#003300" : parameters.internalStrokeColor),
        externalLineWidth = (typeof parameters.externalLineWidth === "undefined" ? 2 : parameters.externalLineWidth),
        externalStrokeColor = (typeof parameters.externalStrokeColor ===  "undefined" ? "#008000" : parameters.externalStrokeColor),
        autoReturnToCenter = (typeof parameters.autoReturnToCenter === "undefined" ? true : parameters.autoReturnToCenter);
      
      // Create Canvas element and add it in the Container object
      var objContainer = document.getElementById(container);
      var canvas = document.createElement("canvas");
      canvas.id = title;
      if(width === 0) { width = objContainer.clientWidth; }
      if(height === 0) { height = objContainer.clientHeight; }
      canvas.width = width;
      canvas.height = height;
      objContainer.appendChild(canvas);
      var context=canvas.getContext("2d");
      
      var pressed = 0; // Bool - 1=Yes - 0=No
        var circumference = 2 * Math.PI;
        var internalRadius = (canvas.width-((canvas.width/2)+10))/2;
      var maxMoveStick = internalRadius + 5;
      var externalRadius = internalRadius + 30;
      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;
      var directionHorizontalLimitPos = canvas.width / 10;
      var directionHorizontalLimitNeg = directionHorizontalLimitPos * -1;
      var directionVerticalLimitPos = canvas.height / 10;
      var directionVerticalLimitNeg = directionVerticalLimitPos * -1;
      // Used to save current position of stick
      var movedX=centerX;
      var movedY=centerY;
        
      // Check if the device support the touch or not
      if("ontouchstart" in document.documentElement)
      {
        canvas.addEventListener("touchstart", onTouchStart, false);
        canvas.addEventListener("touchmove", onTouchMove, false);
        canvas.addEventListener("touchend", onTouchEnd, false);
      }
      else
      {
        canvas.addEventListener("mousedown", onMouseDown, false);
        canvas.addEventListener("mousemove", onMouseMove, false);
        canvas.addEventListener("mouseup", onMouseUp, false);
      }
      // Draw the object
      drawExternal();
      drawInternal();
    
      /******************************************************
       * Private methods
       *****************************************************/
    
      /**
       * @desc Draw the external circle used as reference position
       */
      function drawExternal()
      {
        context.beginPath();
        context.arc(centerX, centerY, externalRadius, 0, circumference, false);
        context.lineWidth = externalLineWidth;
        context.strokeStyle = externalStrokeColor;
        context.stroke();
      }
    
      /**
       * @desc Draw the internal stick in the current position the user have moved it
       */
      function drawInternal()
      {
        context.beginPath();
        if(movedX<internalRadius) { movedX=maxMoveStick; }
        if((movedX+internalRadius) > canvas.width) { movedX = canvas.width-(maxMoveStick); }
        if(movedY<internalRadius) { movedY=maxMoveStick; }
        if((movedY+internalRadius) > canvas.height) { movedY = canvas.height-(maxMoveStick); }
        context.arc(movedX, movedY, internalRadius, 0, circumference, false);
        // create radial gradient
        var grd = context.createRadialGradient(centerX, centerY, 5, centerX, centerY, 200);
        // Light color
        grd.addColorStop(0, internalFillColor);
        // Dark color
        grd.addColorStop(1, internalStrokeColor);
        context.fillStyle = grd;
        context.fill();
        context.lineWidth = internalLineWidth;
        context.strokeStyle = internalStrokeColor;
        context.stroke();
      }
      
      /**
       * @desc Events for manage touch
       */
      function onTouchStart(event) 
      {
        pressed = 1;
      }
    
      function onTouchMove(event)
      {
        // Prevent the browser from doing its default thing (scroll, zoom)
        event.preventDefault();
        if(pressed === 1 && event.targetTouches[0].target === canvas)
        {
          movedX = event.targetTouches[0].pageX;
          movedY = event.targetTouches[0].pageY;
          // Manage offset
          if(canvas.offsetParent.tagName.toUpperCase() === "BODY")
          {
            movedX -= canvas.offsetLeft;
            movedY -= canvas.offsetTop;
          }
          else
          {
            movedX -= canvas.offsetParent.offsetLeft;
            movedY -= canvas.offsetParent.offsetTop;
          }
          // Delete canvas
          context.clearRect(0, 0, canvas.width, canvas.height);
          // Redraw object
          drawExternal();
          drawInternal();
        }
      } 
    
      function onTouchEnd(event) 
      {
        pressed = 0;
        // If required reset position store variable
        if(autoReturnToCenter)
        {
          movedX = centerX;
          movedY = centerY;
        }
        // Delete canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw object
        drawExternal();
        drawInternal();
        //canvas.unbind('touchmove');
      }
    
      /**
       * @desc Events for manage mouse
       */
      function onMouseDown(event) 
      {
        pressed = 1;
      }
    
      function onMouseMove(event) 
      {
        if(pressed === 1)
        {
          movedX = event.pageX;
          movedY = event.pageY;
          // Manage offset
          if(canvas.offsetParent.tagName.toUpperCase() === "BODY")
          {
            movedX -= canvas.offsetLeft;
            movedY -= canvas.offsetTop;
          }
          else
          {
            movedX -= canvas.offsetParent.offsetLeft;
            movedY -= canvas.offsetParent.offsetTop;
          }
          // Delete canvas
          context.clearRect(0, 0, canvas.width, canvas.height);
          // Redraw object
          drawExternal();
          drawInternal();
        }
      }
    
      function onMouseUp(event) 
      {
        pressed = 0;
        // If required reset position store variable
        if(autoReturnToCenter)
        {
          movedX = centerX;
          movedY = centerY;
        }
        // Delete canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw object
        drawExternal();
        drawInternal();
        //canvas.unbind('mousemove');
      }
    
      /******************************************************
       * Public methods
       *****************************************************/
      
      /**
       * @desc The width of canvas
       * @return Number of pixel width 
       */
      this.GetWidth = function () 
      {
        return canvas.width;
      };
      
      /**
       * @desc The height of canvas
       * @return Number of pixel height
       */
      this.GetHeight = function () 
      {
        return canvas.height;
      };
      
      /**
       * @desc The X position of the cursor relative to the canvas that contains it and to its dimensions
       * @return Number that indicate relative position
       */
      this.GetPosX = function ()
      {
        return movedX;
      };
      
      /**
       * @desc The Y position of the cursor relative to the canvas that contains it and to its dimensions
       * @return Number that indicate relative position
       */
      this.GetPosY = function ()
      {
        return movedY;
      };
      
      /**
       * @desc Normalizzed value of X move of stick
       * @return Integer from -100 to +100
       */
      this.GetX = function ()
      {
        return (100*((movedX - centerX)/maxMoveStick)).toFixed();
      };
    
      /**
       * @desc Normalizzed value of Y move of stick
       * @return Integer from -100 to +100
       */
      this.GetY = function ()
      {
        return ((100*((movedY - centerY)/maxMoveStick))*-1).toFixed();
      };
      
      /**
       * @desc Get the direction of the cursor as a string that indicates the cardinal points where this is oriented
       * @return String of cardinal point N, NE, E, SE, S, SW, W, NW and C when it is placed in the center
       */
      this.GetDir = function()
      {
        var result = "";
        var orizontal = movedX - centerX;
        var vertical = movedY - centerY;
        
        if(vertical >= directionVerticalLimitNeg && vertical <= directionVerticalLimitPos)
        {
          result = "C";
        }
        if(vertical < directionVerticalLimitNeg)
        {
          result = "N";
        }
        if(vertical > directionVerticalLimitPos)
        {
          result = "S";
        }
        
        if(orizontal < directionHorizontalLimitNeg)
        {
          if(result === "C")
          { 
            result = "W";
          }
          else
          {
            result += "W";
          }
        }
        if(orizontal > directionHorizontalLimitPos)
        {
          if(result === "C")
          { 
            result = "E";
          }
          else
          {
            result += "E";
          }
        }
        
        return result;
      };
    });

function App() {
  var tile = 40; 


  class Grid extends React.Component{
    constructor(props){
      super(props);
    }

    render()
    {
      var haha=[];
      for(var i=0;i<=135;i++)
        for(var j=0;j<=65;j++)
        { var gstyle = {
          left: i*40 + "px",
          top: j*40 + "px",
          };
          haha.push(<div class="grid" style={gstyle}>{i+","+j}</div>);
        }
      return <div>{haha}</div>;
    }
  }
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
      //console.log("name is: "+this.props.name);
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
        players : this.props.players,
        worldX : -1320,
        worldY : -40,
        worldStyle : {
          top : '-40px',
          left : '-1320px'
        }
      };
      this.moveCam = this.moveCam.bind(this);
    }

    componentDidMount(){
      document.addEventListener('updatePos',  (event) => {
        this.setState({
          players : event.detail.positions
        });
      });

      document.addEventListener('thirdeye',  (event) => {
        var eyex = event.detail.x + this.state.worldX;
        var eyey = event.detail.y + this.state.worldY;

        if(eyex >= 0 )
          eyex = this.state.worldStyle.left;
        else
          eyex = eyex;
        
        if(eyey >= 0 )
          eyey = this.state.worldStyle.top;
        else
          eyey = eyey;
          
        this.setState({
          worldStyle : {
            left : eyex,
            top : eyey
          }
        });
      });

    }

    keyPress(e){
      var playersChanged = JSON.parse(JSON.stringify( this.state.players ));
      var i;
      for(i=0;i<playersChanged.length;i++)
      {
        if(playersChanged[i].name == userPlayer.name)
        { break;}
      }
      if(i==playersChanged.length)
       return;
      var ox = playersChanged[i].x;
      var oy = playersChanged[i].y;

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

      var nx = playersChanged[i].x;
      var ny = playersChanged[i].y;
      if(this.checkValidPosition(nx,ny) & this.checkValidPosition(nx+1,ny))
      {
        this.moveCam(nx,ny);
        socket.emit("changePlayerPositions",playersChanged);
      }
      else 
      {
        playersChanged[i].x = ox;
        playersChanged[i].y = oy;
      }
    }

    checkValidPosition(x,y)
    {
      if(x < 0 || y < 0 || x > 131 || y > 58)
        return false;
      
      y=y+5;
      if (x==18 && y>=7 && y<=25)
        return false;
      if (y==25 && x<=17)
        return false;
      if (y==26 && (x==15 || x==16))
        return false;
      if (y==27 && (x==15 || x==16))
        return false;
      if ((x==1 || x==2) && y>=31 && y<=33)
        return false;
      if ((x==14 || x==15) && y>=31 && y<=33)
        return false;
      if (y>=38 && y<= 43 && x>=2 && x<=13)
        return false;
      // if ((x==2 || x==39) && y>=39 && y<=42)
      //   return false;
      if (y==46 && x<=14)
        return false;
      if (y==47 && x<=15)
        return false;
      if ((x==20 || x==25)&& y>=40 && y<=44)
        return false;
      if ((y==45 || y==40) && x>=20 && x<=24)
        return false;
      if (y>=59 && y<=64 && x>=27 && x<=39)
        return false;
      if (y==7 && ((x>=18 && x<=24) || (x>47 && x<=96)))
        return false;
      if ((x==24 || x==46) && (y==8 || y==9))
        return false;
      if (y==9 && x>=25 && x<=46)
        return false;
      if (y==96 && x>=7 && x<=14)
        return false;
      if (y==49 && x>=39 && x<=59)   
        return false;
      if (x==59 && y>=39 && y<=48)
        return false;
      if ((x==39 || x==40) && y>=37 && y<=48)
        return false;
      if ((y==37 || y==34) && x>=41 && x<=49)
        return false;
      if (x>=50 && x<=56 && y>=34 && y<=37)
        return false;
      if ((x==64 || x==65) && (y==23 || y==26))
        return false;
      if ((x==56 || x==57) && (y==40 || y==43))
        return false;
      if ( (x==39 || x==40) && y>=15 && y<=34)
        return false;
      if (y==15 && x>=41 && x<=69)
        return false;
      if ((x==67||x==68) && y>=22 && y<=28)
        return false;
      if (((x==60 || x==61) && y>=33 && y<=36) || (x==59 && (y==34 || y==35)))
        return false;
      if (y==49 && x>=64 && x<=93)
        return false;
      if (x>=64 && x<=69 && y>=39 && y<=48)
        return false;
      if ( x>=69 && x<=93 && y>=33 && y<=49)
        return false;
      if ( x>=69 && x<=93 && y>=15 && y<=30)
        return false;
      if (y==28 && x>=94 && x<=96)
        return false;
      if (y==27 && x>=97 && x<=110)
        return false;
      if (y==26 && x>=110 && x<=111)
        return false;
      if (y==25 && x>=112 && x<=119)
        return false;
      if (x==120 && y>=25 && y<=27)
        return false;
      if (y==27 && x>=121 && x<=133)
        return false;
      if (x==96 && y>=7 && y<=15)
        return false;
      if ((x==94 || x==95) && y==15)
        return false;
      
      return true;
    }

    moveCam(x,y){
      x = x * 40 + this.state.worldX;
      y = y * 40 + this.state.worldY;
      if((x+88) > (window.innerWidth-400))
        this.state.worldX = this.state.worldX - 40;
      
      if((y + 240) > window.innerHeight)
        this.state.worldY = this.state.worldY - 40;

      if(x < 0)
        this.state.worldX = this.state.worldX + 40;

      if(y < 0)
        this.state.worldY = this.state.worldY + 40;

        console.log(this.state.players);
      this.setState({
        worldStyle : {
          top : this.state.worldY +'px',
          left : this.state.worldX +'px'
        }
      });
      // console.log(this.state.worldX + " " + this.state.worldY);
    }

    render(){
      var karz = this.state.players.map( (player) => <Character id={player.id} avatar={player.avatar} name={player.name} x={player.x} y={player.y} fLeft={player.fLeft} />);
      return(
        <div id="gameBox" onKeyUp={this.keyPress} tabIndex="0">
          
          <div id="gameWorld" style={this.state.worldStyle}>
            {/* <Grid /> */}
            <div class="elem grill"></div>
            <div class="elem board"></div>
            <div class="elem bera"></div>
            <div class="elem bush"></div>
            <div class="elem bush"></div>
            <div class="elem triguna"></div>
            <div class="elem chair"></div>
            <div class="elem bridge"></div>
            <div class="elem goldhapi"></div>
            <div class="elem bigbench"></div>
            <div class="elem smallbench"></div>

          {karz}
          </div>
          <Joysticc/>
          <div id="stren">
            <div>{"People active: " + this.state.players.length}</div>
            {/* <div>{"Coins: " + this.state.players.length}</div> */}
          </div>
        </div>
      );
    }
  } 
  var joy;
  class Joysticc extends React.Component {
   constructor(props){
     super(props);
     this.joymosti = this.joymosti.bind(this);
     this.state = {
       x:0,
       y:0
     }
     this.backtobessa = this.backtobessa.bind(this);
   }
   
   componentDidMount(){
    joy = new JoyStick('joyDiv',{

      // The ID of canvas element
      title: 'joystick',
      
      // width/height
      width: 200,
      height: 200,
      
      // Internal color of Stick
      internalFillColor: '#ffffff',
      
      // Border width of Stick
      internalLineWidth: 2,
      
      // Border color of Stick
      internalStrokeColor: '#ffffff',
      
      // External reference circonference width
      externalLineWidth: 2,
      
      //External reference circonference color
      externalStrokeColor: '#ffffff',
      
      // Sets the behavior of the stick
      autoReturnToCenter: true
      
      });
   }

   joymosti(){
    var newx = joy.GetX()*4;
    var newy = joy.GetY()*4;

    // if( newx != this.state.x || newy != this.state.y )
    // {
      this.setState({
        x: newx,
        y: newy
      });
      document.dispatchEvent(new CustomEvent("thirdeye", {
           detail: 
           {
           x : this.state.x*-1,
           y : this.state.y
           }
      }));
    // }
    
    // document.dispatchEvent(new CustomEvent("updatePos", {
    //   detail: { positions : newPositions }
    // }));
  }

    backtobessa()
    {
        document.dispatchEvent(new CustomEvent("thirdeye", {
          detail: 
          {
          x : 0,
          y : 0
          }
        }));
        
        
    }
  
   render()
   {
     return  (
     <div id="joyraj">
       <div id="joyDiv" onMouseMove={this.joymosti} onMouseUp={this.backtobessa} onMouseLeave={this.backtobessa}></div>
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
    //console.log(newPositions);
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
            x : 36,
            y : 6,
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
      //console.log(this.state.type);
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


