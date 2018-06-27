import React, {Component} from 'react';
import { Collapse } from 'reactstrap';
import {Link, Route} from 'react-router-dom';

import './Navbar.css';
import accountSvg from './images/account.svg';
import newProdSvg from './images/newProd.svg';
// import notificationSvg from './images/notification.svg';
import loginSvg from './images/login.svg';
import logoutSvg from './images/logout.svg';

// sub-components 
import Category from '../Category';
import Signup from '../Signup';
import Login from '../Login';


class Nav extends Component {

    constructor(props){
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state={
            userId: props.userId,
            handleLogin: props.handleLogin,
            loginFailed:props.loginFailed,
            collapse: false 
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({userId: nextProps.userId, loginFailed: nextProps.loginFailed});
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
      }

    render() {
      return (
        <div id="nav-background">
            <nav className="navbar navbar-dark">
                <div className="container">

                    {/*<!-- navbar logo -->*/}
                    <div className="col-4">
                        <Link className="navbar-brand" to="/">
                            <span className="bold">
                                JAM
                            </span>
                            <span className="thin">
                                BID
                            </span>   
                        </Link>
                    </div>

                    {/*<!-- navbar search -->*/}
                    <div className="col-8 category-container">
                        <Category />
                    </div>
                </div>
            </nav>

            {/*<!-- bottom Nav Bar -->*/}
            <nav className="navbar navbar-dark">
                <div className="container">
                    {/* moto */}
                    <div className="col-md-6">
                        <div className="navbar-quote">
                            <span>
                                Sweet deals that stick
                            </span>    
                        </div>
                    </div>

                    {/*<!-- Nav links -->*/}
                    <div className="col-md-6 ">
                        <ul className="nav float-right navlink-container">

                            {this.state.userId !== null ?
                                [<li key={"a"} className="nav-item">
                                    <Route render={({history})=>
                                        <div className="nav-link nav-icon"
                                            style={{cursor: "pointer"}}
                                            onClick={() => {history.push(`/account`, {viewUser:null})}}>
                                            <img src={accountSvg} className="svg-btn" alt=""/>
                                        </div>
                                    }/>
                                </li>,
                                <li key={"new"} className="nav-item">
                                    <Link className="nav-link nav-icon" to="/product-new">
                                        <img src={newProdSvg} className="svg-btn" alt=""/> 
                                    </Link>
                                </li>
                                // ,
                                // <li key={"not"}className="nav-item">
                                //     <Link className="nav-link nav-icon" to="">
                                //         <img src={notificationSvg} className="svg-btn" alt=""/> 
                                //     </Link>
                                // </li>
                                ]
                            : null}

                            {/*<!-- login button -->*/}
                            {this.state.userId !== null ?
                                <li className="nav-item">
                                    <div className="nav-link nav-icon log-btn" onClick={this.props.handleLogout}>      
                                        <img src={logoutSvg} className="svg-btn" alt="" />
                                    </div>
                                </li> 
                            :  <li className="nav-item">
                                    <div className="nav-link nav-icon log-btn" onClick={this.toggle}>
                                        <img  src={loginSvg}  className="svg-btn" alt=""/>
                                    </div>
                                </li> 
                            }
                            
                        </ul>
                    </div>

                </div>
            </nav>

            {/* navbar extension menu */}
                {/* {this.state.collapse !== false ? */}
                <Collapse isOpen={this.state.collapse}>
                    <nav className="navbar navbar-light bg-light p-0"  style={{zIndex:1}}>
                        <div id="navcollapse" className=" navbar-collapse" >
                            <div className="navbar-nav" id="accordion">
                                <div className="mx-auto">

                                        {/* sign-up and login buttons */}
                                        <div className="card text-center" id="accordian-header">
                                            <div className="card-body">
                                                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                                <label className="btn btn-outline-secondary form-toggle active" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    <input type="radio" name="options" /> Sign Up
                                                </label>
                                                <label className="btn btn-outline-secondary form-toggle" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                    <input type="radio" name="options" /> Login
                                                </label>
                                                </div>
                                            </div>
                                        </div>
                                        <Signup onClick={this.toggle} />
                                        <Login userName={this.props.userName} password={this.props.password} onClick={this.props.handleLogin}  toggle={this.toggle} loginFailed={this.state.loginFailed} />

                                </div>
                            </div>
                        </div>
                    </nav> 
                </Collapse>
            {/* : null } */}

        </div>

      );
    }
  }

  export default Nav;