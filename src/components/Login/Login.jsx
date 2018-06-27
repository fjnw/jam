import React, {Component} from 'react';

import './Login.css';

class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            userName: {val:"", isValid: true, errors: [], isRequired: true},
            password: {val:"", isValid: true, errors: [], isRequired: true},
            handleClick: props.onClick,
            loginFailed: props.loginFailed,
            toggle: props.toggle
        }
    }

    componentWillReceiveProps(nextProps){
        let obj = this.state;

        obj.userName.val = nextProps.userName;
        obj.password.val = nextProps.password;
        obj.loginFailed = nextProps.loginFailed;
        this.setState(obj);
    }

    //function to validate the input
    validateInputs(name){
        let obj = this.state[name];
        let msg = [];
        let valid = true;

        if(name === 'userName'){
            if(this.state.userName.isRequired){
                if(this.state.userName.val === ""){
                    msg.push("Username is required.");
                    valid = false;
                }
            }
        }
        else if(name === 'password'){
            if(this.state.password.isRequired){
                if(this.state.password.val === ""){
                    msg.push("Password is required.");
                    valid = false;
                }
            }
        }

        obj.isValid = valid;
        obj.errors = msg;

        this.setState({[name]:obj});

    }

    //function to update the state when the element detects a change
    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        let obj = this.state[name];

        obj.val = value;

        this.setState({
            [name]:obj
        });
    }

    //function to handle onBlue (onFocusOut)
    handleFocusOut = (event) => {
        const name = event.target.name;
        this.validateInputs(name);
    }

    //function to handle the button click event
    handleClick = (event) => {
        event.preventDefault();

        this.validateInputs('userName');
        this.validateInputs('password');

        if(this.state.userName.isValid && this.state.password.isValid)
            this.state.handleClick(this.state.userName.val, this.state.password.val, this.state.toggle);
    }

    render() {
        return (
            <div>
                {/*<!-- login form -->*/}
                <div className="card form-area">
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                        <div className="card-body">
                            {/*<!--  <h3 className="text-center mb-4">Login</h3> -->*/}
                            <fieldset>
                                {this.state.userName.errors.length > 0 || this.state.password.errors.length > 0 || this.state.loginFailed?
                                    <div className="alert alert-danger">
                                        {this.state.userName.errors.map((m,i) => (
                                            <p key={"u_"+i}>* {m}</p>
                                        ))}
                                        {this.state.password.errors.map((m,i) => (
                                            <p key={"p_"+i}>* {m}</p>
                                        ))}
                                        {this.state.loginFailed ? "* Invalid Username/Password" : null}
                                    </div>
                                :null}
                                <form>
                                    <div className="form-group has-error">
                                        <input className={this.state.userName.isValid ?"form-control input-md form-input":"form-control input-md form-input error"}
                                            autoComplete="username"
                                            placeholder="Username"
                                            name="userName"
                                            value={this.state.userName.val}
                                            onChange={this.handleChange}
                                            onBlur={this.handleFocusOut}
                                            type="text" />
                                    </div>
                                    <div className="form-group has-success">
                                        <input className={this.state.password.isValid ?"form-control input-md form-input":"form-control input-md form-input error"}
                                            autoComplete="current-password"
                                            placeholder="Password"
                                            name="password"
                                            value={this.state.password.val}
                                            onChange={this.handleChange}
                                            onBlur={this.handleFocusOut}
                                            type="password" />
                                    </div>
                                    <button className="btn btn-md btn-block form-btn" onClick={this.handleClick} type="submit" id="login-btn">Login</button>
                                </form>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;