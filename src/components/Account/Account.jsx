import React, {Component} from 'react';
import {Route, Redirect, Link} from 'react-router-dom';
import jwt from 'jsonwebtoken';
import ReactTable from "react-table";
import Moment from 'react-moment';
import DateFormat from 'dateformat';

import API from '../../utils/API';
import './Account.css';
import "react-table/react-table.css";

import list from "../../categoryList";


class Account extends Component {
    constructor(props){
        super(props);

        this.state = {
            cert: props.cert,
            userId: props.userId,
            viewUser: props.location ? props.location.state ? props.location.state.viewUser:null:null,
            userInfo: {
                userName:"",
                createTs:"",
                firstName:"",
                lastName:"",
                email:"",
                image:null,
                imageType:null
            },
            edit: false,
            editPassword: false,
            editInfo: {
                userName:"",
                firstName:"",
                lastName:"",
                email:""
            },
            password:"",
            retypePassword:"",
            sellHistory: [],
            buyHistory: []
        }
    }

    componentWillMount() {
        let obj = this;
        let token = JSON.parse(sessionStorage.getItem("JamBid"));
        if(token){
            if(token.token)
                jwt.verify(token.token, obj.state.cert, (err, decode) => {
                if(err) console.log("err",err);

                if(decode)
                    obj.setState({userId:decode.userId},this.loadUser);
                });
        }
        else
            this.loadUser();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.location.state)
            this.setState({userId:nextProps.userId, viewUser:nextProps.location.state.viewUser, sellHistory: [], buyHistory: []},this.loadUser)
    }

    //function for loading user info
    loadUser = () => {
        let id = null;
        if(this.state.viewUser)
            id = this.state.viewUser;
        else
            id = this.state.userId;

        if(id){
            API.getUser(id)
            .then( res => {
                this.setState({userInfo: res.data[0]})
            })
            .catch(err => console.log(err));

            API.getBuyHistory(id)
            .then(res => {
                if(res.data)
                    this.setState({buyHistory: res.data})
            })
            .catch(err => console.log(err));

            API.getSellHistory(id)
            .then(res => {
                if(res.data)
                    this.setState({sellHistory: res.data})
            })
            .catch(err => console.log(err));
        }
    }

    //function to submit change to server
    saveUserChanges = (event) => {
        event.preventDefault();
        let obj = this;
        
        //builds the object to pass
        let userChange = {};
        if(this.state.editInfo.firstName !== ""){
            userChange = {
                'firstName':this.state.editInfo.firstName,
                'lastName':this.state.editInfo.lastName,
                'email':this.state.editInfo.email
            };
        }

        //checks if the password should be added
        if(this.state.password !== ""){
            if(this.state.password === this.state.retypePassword){
                userChange.password = this.state.password;
            }
        }
        
        if(userChange !== {}){
            API.saveUserChange(userChange, this.state.userId)
            .then(function(data){
                //object used to determine what has updated
                let newUserInfo = obj.state.userInfo;

                //builds the new current info if there are changes
                for(let i in userChange){
                    if(i !== 'password')
                        newUserInfo[i] = userChange[i];
                }

                //updates the component
                obj.setState({
                    userInfo: newUserInfo,
                    edit: false,
                    editPassword: false,
                    editInfo: {
                        userName:"",
                        firstName:"",
                        lastName:"",
                        email:""
                    },
                    password:"",
                    retypePassword:""
                });
            })
            .catch(function(error){
                console.log(error);
            })
        }
    }

    //function to toggle to edit fields
    setEdit = (event) => {
        event.preventDefault();
        let obj = this.state.userInfo;

        this.setState({
            edit: true,
            editInfo: obj
        });
    }

    //function to toggle to cancel edit of fields
    cancelEdit = (event) => {
        this.setState({
            edit: false,
            editInfo: {}
        });

        this.cancelPassword();
    }

    //function to toggle to edit of password
    setPassword = (event) => {
        this.setState({
            editPassword: true
        });
    }

    //function to toggle to cancel edit of password
    cancelPassword = (event) => {
        this.setState({
            editPassword: false,
            password: "",
            retypePassword: ""
        });
    }

    //function to handle changes of value for the edit fields
    handleInput = (event) => {
        //this is needed to break from linking to the json in memory
        let editData = {
            userName:this.state.editInfo.userName,
            firstName:this.state.editInfo.firstName,
            lastName:this.state.editInfo.lastName,
            email:this.state.editInfo.email
        }

        const name = event.target.name;
        const value = event.target.value;

        editData[name] =value;
        this.setState({editInfo:editData});
    }

    //function to handle the change of values for the password fields
    handlePasswordChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]: value
        });
    }

    render() {
        let keys = Object.keys(list);
        
        return (
            <div>

                <form className="form-sign-up mt-3">
                    <div className="row">
                        
                        {/* left side */}
                        <div className="col-md-6 col-sm-12 mb-5 text-center">
                            {!(this.state.userId || this.state.viewUser) ? <Redirect to="/"/>:null}

                            {/* edit btn */}
                            <div className="form-group">
                                {(this.state.edit || this.state.editPassword) && (this.state.viewUser === this.state.userId || this.state.viewUser === null)?
                                    <div className="row inline">
                                        <div className="col-6 px-1">
                                            <button className="btn btn-md btn-block btn-hover " type="submit" onClick={this.saveUserChanges}>Submit</button>
                                        </div>
                                        {this.state.edit ?
                                            <div className="col-6 px-1">
                                                <button className="btn btn-md btn-block btn-hover " type="submit"onClick={this.cancelEdit}>Cancel</button>
                                            </div>
                                        :
                                            <div className="col-6 px-1">
                                                <button className="btn btn-md btn-block btn-hover " type="submit"onClick={this.setEdit}>Edit</button>
                                            </div>
                                        }
                                    </div>
                                : null }
                                {!(this.state.edit || this.state.editPassword) && (this.state.viewUser === this.state.userId || this.state.viewUser === null)?
                                    <button className="btn btn-md btn-block btn-hover " type="submit" onClick={this.setEdit}>Edit</button>
                                : null} 
                            </div>

                            {!(this.state.userId || this.state.viewUser) ? <Redirect to="/"/>:null}
                                <div className="row">
                                    <div className="mx-auto">
                                        <div className="card card-area">
                                            {/* full name */}
                                            <div className="card-header form-header">{this.state.userInfo.firstName} {this.state.userInfo.lastName}</div>
                                            <div className="card-body avatar-container d-flex justify-content-center">
                                                {this.state.userInfo.imageType === 'file' && this.state.userInfo.image ? 
                                                    <img className="avatar my-auto" src={require(`../../files/accounts/${this.state.userInfo.image.split("\\")[this.state.userInfo.image.split("\\").length-1]}`)} alt=""/>
                                                :
                                                    this.state.userInfo.image ?
                                                        <img className="avatar my-auto" src={this.state.userInfo.image} alt=""/>
                                                : null}
                                            </div>{/* -card-body */}
                                    </div>{/* -card-area */}
                                </div> {/* -row */}
                            </div> {/* -form-group */}
                        </div> {/* -col */}


                        {/* form inputs */}
                        <div className="col-md-6 col-sm-12">
                            <div className="row">
                                    
                                {/* Username */}
                                <div className="col-md-12 col-sm-6 pr-0">
                                    <div className="card form-area">
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text form-btn-b wide">Username</span>
                                                    </div>
                                                    {/* <input className="form-control form-textarea form-input" */}
                                                    <input type="text"
                                                        name="userName"
                                                        className="form-control form-preview"
                                                        readOnly={!this.state.edit ? true : true}
                                                        value={!this.state.edit ? this.state.userInfo.userName : this.state.editInfo.userName}
                                                        onChange={this.handleInput}/>
                                                </div>
                                            </div>
                                    </div> {/* -card */}
                                </div> {/* -col */}

                                {/*  created date */}
                                <div className="col-md-12 col-sm-6 pr-0">
                                    <div className="card form-area">
                                        <div className="form-group ">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-btn-b wide">Created</span>
                                                </div>
                                                <input type="text"
                                                    name=""
                                                    className="form-control form-preview"
                                                    readOnly
                                                    value={DateFormat(this.state.userInfo.createTs, "mm/dd/yyyy")}
                                                    onChange={this.handleInput}/>
                                            </div>
                                        </div>
                                    </div> {/* -card */}
                                </div> {/* -col */}
                            </div> {/* -row */}

                            {/*  first name */}
                            <div className="row">
                                <div className="col-md-12 col-sm-6 pr-0">
                                    <div className="card form-area">
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text form-btn-b wide">First Name</span>
                                                    </div>
                                                    <input type="text"
                                                        name="firstName"
                                                        className= {!this.state.edit ? "form-control form-preview":"form-control form-input"} 
                                                        readOnly={!this.state.edit ? true : false}
                                                        value={!this.state.edit ? this.state.userInfo.firstName : this.state.editInfo.firstName}
                                                        onChange={this.handleInput}/>
                                                </div>
                                            </div>
                                    </div> {/* -card */}
                                </div> {/* -col */}

                                    {/*  last name */}
                                <div className="col-md-12 col-sm-6 pr-0">
                                    <div className="card form-area">
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-btn-b wide">Last Name</span>
                                                </div>
                                                <input type="text"
                                                    name="lastName"
                                                    className= {!this.state.edit ? "form-control form-preview":"form-control form-input"} 
                                                    readOnly={!this.state.edit ? true : false}
                                                    value={!this.state.edit ? this.state.userInfo.lastName : this.state.editInfo.lastName}
                                                    onChange={this.handleInput}/>
                                            </div>
                                        </div>
                                    </div> {/* -card */}
                                </div> {/* -col */}
                            </div> {/* -row */}

                            {/* email */}
                            <div className="row">
                                <div className="col-12 pr-0">
                                    <div className="card form-area">
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-btn-b wide">Email</span>
                                                </div>
                                                <input type="email"
                                                    name="email"
                                                    className= {!this.state.edit ? "form-control form-preview":"form-control form-input"} 
                                                    readOnly={!this.state.edit ? true : false}
                                                    value={!this.state.edit ? this.state.userInfo.email : this.state.editInfo.email}
                                                    onChange={this.handleInput}/>
                                            </div>
                                        </div>
                                    </div> {/* -card */}
                                </div> {/* -col */}
                            </div>  {/* -row */}

                            {/* edit password */}
                            {this.state.editPassword && (this.state.viewUser === this.state.userId || this.state.viewUser === null)?
                                <div> 
                                    {/* cancel password  */}
                                    {!this.state.edit ?
                                        <div className="row">
                                            <div className="col-12 pr-0">
                                                <div className="form-group">
                                                    <button className="btn btn-md btn-block btn-hover " type="submit" onClick={this.cancelPassword}>Cancel Password Change</button>
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        null
                                    }

                                    {/* input: password  */}
                                    <div className="row">
                                        <div className="col-md-12 col-sm-6 pr-0">
                                            <div className="card form-area">
                                                    <div className="form-group">
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <span className="input-group-text form-btn-b wide">Password</span>
                                                            </div>
                                                            <input className="form-control form-textarea form-input"
                                                                name="prodName"
                                                                value=""
                                                                onChange={this.handleChange}
                                                                type="text" />
                                                        </div>
                                                    </div>
                                            </div> {/* -card */}
                                        </div> {/* -col */}
    
                                        {/* input: confirm password  */}
                                        <div className="col-md-12 col-sm-6 pr-0">
                                            <div className="card form-area">
                                                <div className="form-group ">
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text form-btn-b wide">Confirm</span>
                                                        </div>
                                                        <input className="form-control form-textarea form-input"
                                                            name="prodName"
                                                            value=""
                                                            onChange={this.handleChange}
                                                            type="text" />
                                                    </div>
                                                </div>
                                            </div> {/* -card */}
                                        </div> {/* -col */}
                                    </div>   {/* -row */}
                                </div>
                            :
                                this.state.viewUser === this.state.userId || this.state.viewUser === null ?
                                    <div className="row">
                                        {/* change password */}
                                        <div className="col-12 pr-0">
                                            <input className="btn btn-md btn-block btn-hover" value="Change Password" readOnly onClick={this.setPassword}/>
                                        </div>
                                    </div>
                                :
                                    null
                            }

                        </div> {/* -col */}
                    </div> {/* -row */}


                </form> {/* -form */}
                
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="card card-area">

                            <div className="card-header form-header text-center">
                                <h5>Sell History</h5>
                            </div>

                            {/* table */}
                            <div className="card-body table-style">
                                <ReactTable
                                    data= {this.state.sellHistory}
                                    columns={[
                                        {
                                            Header: "Product Name",
                                            accessor: "prodName",
                                            Cell: props => <Link to={`/product/${props.original.prodId}`} >{props.value}</Link>
                                        },
                                        {
                                            Header: "Category",
                                            accessor: "category",
                                            Cell: props => (keys.map((k,i) => (list[k] === props.value ? k :null)))
                                        },
                                        {
                                            Header: "Sell Timestamp",
                                            accessor: "endTimestamp",
                                            Cell: props => (<Moment format="MM/DD/YY LT">{props.value}</Moment>)
                                        },
                                        {
                                            Header: "Buyer",
                                            accessor: "buyerName",
                                            Cell: props => (<Route render={({history})=>
                                                                <span className="form-text" style={{cursor: "pointer", textDecoration:"underline"}}
                                                                    onClick={() => {history.push(`/account`, {viewUser:props.original.buyerId})}}>
                                                                        {props.value}
                                                                </span>
                                                            }/>)
                                        },
                                        {
                                            Header: "Amount",
                                            accessor: "amount",
                                            Cell: props => (`$${props.value}`)
                                        }
                                    ]}
                                    defaultPageSize={5}
                                    className="-striped -highlight"
                                />
                            </div>

                            {/* card footer - tip */}
                            <div className="card-footer form-footer footer-tip">
                                Tip: Hold <kbd>shift</kbd> when sorting to multi-sort!
                            </div>
                                
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12">
                        <div className="card card-area">

                            <div className="card-header form-header text-center">
                                <h5>Purchase History</h5>
                            </div>

                            {/* table */}
                            <div className="card-body table-style">
                                <ReactTable
                                    data= {this.state.buyHistory}
                                    columns={[
                                        {
                                            Header: "Product Name",
                                            accessor: "prodName",
                                            Cell: props => <Link to={`/product/${props.original.prodId}`} >{props.value}</Link>
                                        },
                                        {
                                            Header: "Category",
                                            accessor: "category",
                                            Cell: props => (keys.map((k,i) => (list[k] === props.value ? k :null)))
                                        },
                                        {
                                            Header: "Buy Timestamp",
                                            accessor: "endTimestamp",
                                            Cell: props => (<Moment format="MM/DD/YY LT">{props.value}</Moment>)
                                        },
                                        {
                                            Header: "Seller",
                                            accessor: "sellerName",
                                            Cell: props => (<Route render={({history})=>
                                                                <span className="form-text" style={{cursor: "pointer", textDecoration:"underline"}}
                                                                    onClick={() => {history.push(`/account`, {viewUser:props.original.sellerId})}}>
                                                                        {props.value}
                                                                </span>
                                                            }/>)
                                        },
                                        {
                                            Header: "Amount",
                                            accessor: "amount",
                                            Cell: props => (`$${props.value}`)
                                        }
                                    ]}
                                    defaultPageSize={5}
                                    className="-striped -highlight"
                                />
                            </div>

                            {/* card footer - tip */}
                            <div className="card-footer form-footer footer-tip">
                                Tip: Hold <kbd>shift</kbd> when sorting to multi-sort!
                            </div>
        
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}

export default Account;