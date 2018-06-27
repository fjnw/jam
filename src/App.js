import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import jwt from 'jsonwebtoken';
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
//import { css } from 'glamor';

import Nav from './components/Navbar';
import API from './utils/API';

// routes
import Homepage from './components/Homepage';
import Account from './components/Account';
import Product from './components/Product';
import ProductNew from './components/ProductNew';
import NoMatch from "./components/NoMatch";
import Search from "./components/Search";

const cert = "phrase";

//link toast component
const Msg = (props,{closeToast}) => (
  <div>You were out bid on<br/><Link className="toast-link" onClick={closeToast} to={`/product/${props.prodId}`}>{props.prodName}</Link></div>
)

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      userId: null,
      loginFailed:false,
      socket: null
    }
  }

  componentWillMount(){
    this.setState({socket: io()});
  }

  componentDidMount(){
    let token = JSON.parse(sessionStorage.getItem("JamBid"));
    if(token){
      if(token.token)
        jwt.verify(token.token, cert, (err, decode) => {
          if(err) console.log("err",err);

          if(decode)
            this.setState({userId:decode.userId})
        });
    }

    this.receive();
  }

  //method to receive messages from the socket
  receive = () => {
    this.state.socket.on('outbid', (toastMsg) => {
      if(this.state.userId === toastMsg.userId)
        toast(<Msg prodId={toastMsg.prodId} prodName={toastMsg.prodName}/>, {
          position: toast.POSITION.TOP_RIGHT,
          // className: css({
          //   border: "2px solid #841baa",
          //   bordeRadius: "0",
          //   background: "rgba(132, 27, 170, .6)",
          //   color: "white",
          //   textAlign: "center"
          // }),
          className: "toast",
          autoClose: 5000
        })
    });
  }

  //login method
  handleClickLogin = (userName, password, toggle) => {
    let obj = this;
    API.logUserIn(userName, password)
    .then(function(result){
      if(result.data[0]){
        jwt.sign({userId: result.data[0].id}, cert, (err, token) => {
          if (err) console.log("err", err);
          else {
            sessionStorage.setItem("JamBid", JSON.stringify({ token:token, time: new Date() }));
            obj.setState({userId: result.data[0].id, loginFailed:false}, toggle);
          }
        });
      }
      else{
        obj.setState({loginFailed:true});
      }
    })
    .catch(function(error){
      console.log("error: "+error);
    })
  }

  //logout method
  handleClickLogout = () => {
    this.setState({userId:null},sessionStorage.removeItem("JamBid"));
  }

  render() {
    return (
      <Router>
        <div>
          <ToastContainer />
          <Nav userName='' password=''  userId={this.state.userId} handleLogin={this.handleClickLogin} handleLogout={this.handleClickLogout} loginFailed={this.state.loginFailed}/>
          <div className="container content">
            <Switch>
              <Route exact path="/" component={Homepage}/>
              <Route path="/search/:category" component={Search} />
              <Route exact path="/account" render={props => <Account userId={this.state.userId} location={props.location} cert={cert}/>}/>
              <Route path="/product/:id" render={props => <Product userId={this.state.userId} />}/>
              <Route path="/product-new"render={props => <ProductNew userId={this.state.userId} cert={cert}/>} />
              <Route component={NoMatch} />
            </Switch>

            <div className="navbar-fixed-bottom m-5 text-center">Copyright &copy; 2018 <strong>JAM</strong>BID. All rights reserved.</div>

          </div>
        </div>
      </Router>
    );
  }
}

export default App;
