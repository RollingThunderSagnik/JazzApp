import React from 'react';
import logo from './logo.svg';
import './App.css';

var names = [
  {name: 'Jashomoti',
   child: ['Jasho','Jashomonti','Jazzmoti','Jasho','Jashomonti','Jazzmoti','Jasho','Jashomonti','Jazzmoti','Jasho','Jashomonti','Jazzmoti']
  },
  {name: 'Jashomonti',
   child: ['Jashomonty']
  }
]
function App() {

  class Field extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        name: this.props.info.name,
        child: this.props.info.child
      }
    }
    render(){
     var subs = this.state.child.map((namu) => <h1 className="nameholder child">{namu}</h1>);
    var halo = [<h1 className="nameholder">{this.state.name}</h1>,<br/>,...subs];
     return (
       <div>
        <div className="namebloc">
          {halo}
        </div>
        </div>
      );
    }
  }
  var re=[];
   re.push(<Field info={names[0]}/>);
  return re;
}

export default App;


.nameholder {
  position: relative;
  display: inline-block;
  width: fit-content;
  background: #e00043;
  color: #fff;
  margin: 0;
  /* line-height: 75px; */
  border-radius: 10px;
  padding: 20px;
  font-size: xx-large;
  margin-bottom: 10px;
  margin-right: 10px;
  transition: all 0.5s ease;
  border: #e00043 solid 5px;
  cursor: pointer;
  /* float: left; */
}
#PhiriyeDao {
  position: fixed;
  border-radius: 50%;
  height: 25px;
  top: 10px;
  left: 10px;
  line-height: 15px;
}
.namebloc {
  text-align: center;
  display: inline-block;
  margin-bottom: 10px;
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.child {
  font-size: large;
  display: inline-block;
  /* transform: scale(0.75,0.75); */
  /* float: left; */
}
.nameholder:hover {
  color: #e00043;
  background: #fff;
}