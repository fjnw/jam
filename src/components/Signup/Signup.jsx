import React, {Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import API from '../../utils/API';
import './Signup.css';


class Signup extends Component {
    constructor(props){
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            email: {value:"", isValid: true, message:[], isRequired: true},
            firstName:{value:"", isValid: true, message:[], isRequired: true},
            lastName:{value:"", isValid: true, message:[], isRequired: true},
            password: {value:"", isValid: true, message:[], isRequired: true},
            retypePassword: {value:"", isValid: true, message:[], isRequired: true},
            userName: {value:"", isValid: true, message:[], isRequired: true},
            image: {value:"", file: null, type: 'file', isValid: true, message:[], isRequired: false},
            terms: {value: false , isValid: true, message:[], isRequired: true},
            toggle: props.onClick,
            modal: false
        }
    }
    
    //function to update the state when the element detects a change
    handleChange = (event) => {
      
        const name = event.target.name;
        let value = "";
        const type = event.target.type;

        if(type === 'checkbox')
            value = event.target.checked;
        else
            value = event.target.value.trim();

        let obj = this.state[name];
        obj.value = value;

        this.setState({
            [name]:obj
        });
    }

    //function that is used when there is a change on an input
    handleImageChange = (event) => {
        let value = event.target.value;
        let file = event.target.files[0];
        let obj = this.state.image;

        //check file size limit is in bytes
        if(file){
            if(file.size < 1000000){

                obj.value = value;
                obj.file = file;
                obj.message = [];
                obj.isValid = true;

                this.setState({
                    image:obj
                });
            }
            else{
                obj.message=["File must be less than 1MB"];
                obj.isValid = false;
                obj.value = "";
                obj.file = null;

                this.setState({
                    image:obj
                });
            }
        }
    }

    handleClick = (event) => {
        event.preventDefault();
        let obj = this;

        //loops through the state JSON
        for(let i in obj.state){
            if(obj.state[i].hasOwnProperty('isValid'))
                obj.formValidation(i);
        }
        
        if (!this.checkForErrors()) {
            let userName = this.state.userName;

            API.signUpNewUser({
                email:this.state.email.value,
                firstName:this.state.firstName.value,
                lastName:this.state.lastName.value,
                password:this.state.password.value,
                userName:this.state.userName.value,
                image:this.state.image
            })
            .then(function(result){
                if(result.data.status === 'good') {
                    // if successful login -> collapse nav menu
                    obj.state.toggle();

                    //clears the state
                    obj.setState({
                        email: {value:"", isValid: true, message:[], isRequired: true},
                        firstName:{value:"", isValid: true, message:[], isRequired: true},
                        lastName:{value:"", isValid: true, message:[], isRequired: true},
                        password: {value:"", isValid: true, message:[], isRequired: true},
                        retypePassword: {value:"", isValid: true, message:[], isRequired: true},
                        userName: {value:"", isValid: true, message:[], isRequired: true},
                        image: {value:"", file: null, type: 'file', isValid: true, message:[], isRequired: false},
                        terms: {value: false , isValid: true, message:[], isRequired: true}
                    });
                }
                else{
                    userName.isValid = false;
                    userName.message.push(result.data.msg);

                    obj.setState({userName:userName})
                }
            })
            .catch(function(error){
                console.log(error);
            });
        }
    }

    //function to perform the validation on the input fields
    formValidation = (name) => {
        let valid = true;
        let obj = this.state[name];
        let errorMsg = [];

        if (name === "userName"){
            if (this.state[name].isRequired && !this.state[name].value){
                errorMsg.push(`Username field is Required`);
                valid = false;
            }
            else{
                if(this.state[name].value.length < 4){
                    errorMsg.push("Username is too short");
                    valid = false;
                }

                if(!this.state[name].value.match(/^[a-zA-Z0-9_.-]*$/)) {
                    errorMsg.push("Use letters and numbers for Username");
                    valid = false;                
                }
            }
        }
        else if(name === "email"){
            if(this.state[name].isRequired && !this.state[name].value){
                errorMsg.push(`Email field is Required`);
                valid = false;
            }
            else{
                if(!this.state[name].value.match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/)){
                    errorMsg.push("invalid Email");
                    valid = false;
                }
            }
        }
        else if(name === "firstName"){
            if(this.state[name].isRequired && !this.state[name].value){
                errorMsg.push(`First name field is Required`);
                valid = false;
            }
            else{
                if(this.state[name].value.match(/^[0-9]+$/)){
                    errorMsg.push(`Numbers are not allowed`);
                    valid = false;
                }
            }
        }
        else if(name === "lastName"){
            if(this.state[name].isRequired && !this.state[name].value){
                errorMsg.push(`Last name field is Required`);
                valid = false;
            }
            else{
                if(this.state[name].value.match(/^[0-9]+$/)){
                    errorMsg.push(`Numbers are not allowed`);
                    valid = false;
                }
            }
        }
        else if(name === "password"){
            if(this.state[name].isRequired && !this.state[name].value){
                errorMsg.push(`Password field is Required`);
                valid = false;   
            }
            else{
                if(this.state[name].value.length < 4){
                    errorMsg.push("Password is too short");
                    valid = false;
                }
            }
        }
        else if(name === "retypePassword"){
            if(this.state[name].isRequired && !this.state[name].value){
                errorMsg.push(`Confirm your password field is Required`);
                valid = false;   
            }
            else{
                if(this.state[name].value !== this.state.password.value){
                    errorMsg.push("Password and Confirm Password does not match");
                    valid = false;
                }
            }
        }
        else if(name === "terms"){
            if(this.state[name].isRequired && !this.state[name].value){
                errorMsg.push("Please indicate you agree with Terms and Conditions");
                valid = false;
            }
        }

        obj.isValid = valid;
        obj.message = errorMsg;

        this.setState({[name]:obj})
    }

    //function for onBlue (cursor leaving target)
    handleFocusOut = (event) => {
        const name = event.target.name;

        if(this.state[name].hasOwnProperty('isValid'))
            this.formValidation(name);
    }

    //function to verify there are no errors
    checkForErrors = () =>{
        let errorFound = false;

        for(let i in this.state){
            if(this.state[i].hasOwnProperty('isValid'))
                if(!this.state[i].isValid)
                    errorFound = true;
        }
        return errorFound;
    }

    toggle() {
        this.setState({
          modal: !this.state.modal
        });
      }
    

    render() {

      let keys = Object.keys(this.state);

       return (
            <div>
                {/*<!-- sign-up form -->*/}
                <div className="card form-area">
                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                        {/*<!-- error modal display -->*/}
                            <div className="card card-body form-area ">
                            {this.checkForErrors() ?
                                <div className="alert alert-danger">
                                    {keys.map((k,i) =>(
                                        k !== "toggle" && k!=="modal" ? 
                                            this.state[k].message.map((m,j) =>(
                                                <p key={i+"_"+j}>{`* ${m}`}</p>
                                            ))
                                        : null
                                    ))}
                                </div>
                            :null}

                            {/*<!-- <h3 className="text-center mb-4">Sign-up</h3> -->*/}
                            <fieldset>
                                <form>
                                    <div className="form-group">
                                        <input className={this.state.userName.isValid ? "form-control input-md form-input" : "form-control input-md form-input error"}
                                            placeholder="Username (letters and numbers only)"
                                            name="userName"
                                            type="text"
                                            autoComplete="username"
                                            value={this.state.userName.value}
                                            onChange={this.handleChange} 
                                            onBlur={this.handleFocusOut}/>
                                    </div>
                                    <div className="form-row mb-3">
                                        <div className="col-6 r-pad">
                                            <input className={this.state.firstName.isValid ? "form-control input-md form-input" : "form-control input-md form-input error"}
                                                placeholder="First Name"
                                                name="firstName"
                                                type="text"
                                                value={this.state.firstName.value}
                                                onChange={this.handleChange}
                                                onBlur={this.handleFocusOut} />
                                        </div>
                                        <div className="col-6 l-pad">
                                            <input className={this.state.lastName.isValid ? "form-control input-md form-input l-border" : "form-control input-md form-input l-border error"}
                                                placeholder="Last Name"
                                                name="lastName"
                                                type="text"
                                                value={this.state.lastName.value}
                                                onChange={this.handleChange}
                                                onBlur={this.handleFocusOut} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input className={this.state.email.isValid ? "form-control input-md form-input" : "form-control input-md form-input error"}
                                            placeholder="E-mail Address"
                                            name="email"
                                            autoComplete="email"
                                            type="email" value={this.state.email.value}
                                            onChange={this.handleChange} 
                                            onBlur={this.handleFocusOut} />
                                    </div>

                                    <div className="form-row mb-3">
                                        <div className="col-6 r-pad">
                                            <input className={this.state.password.isValid ? "form-control input-md form-input" : "form-control input-md form-input error"}
                                                placeholder="Password"
                                                name="password"
                                                type="password"
                                                autoComplete="new-password"
                                                value={this.state.password.value}
                                                onChange={this.handleChange}
                                                onBlur={this.handleFocusOut} />
                                        </div>
                                        <div className="col-6 l-pad">
                                            <input className={this.state.retypePassword.isValid ? "form-control input-md form-input l-border" : "form-control input-md form-input error l-border"}
                                                placeholder="Confirm Password"
                                                name="retypePassword"
                                                type="password"
                                                autoComplete="new-password"
                                                value={this.state.retypePassword.value}
                                                onChange={this.handleChange}
                                                onBlur={this.handleFocusOut} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input 
                                            type="file" 
                                            className={this.state.image.isValid ? "form-control input-md form-input" : "form-control input-md form-input error"}
                                            name="image"
                                            imagetype="file"
                                            value={this.state.image.value}
                                            onChange={this.handleImageChange} />
                                    </div>
                                    <div className="checkbox">
                                        <label className="small">
                                            <input 
                                                className={this.state.image.isValid ? "term" : "term error"}
                                                type="checkbox"
                                                name="terms" 
                                                checked ={this.state.terms.value}
                                                onChange={this.handleChange}
                                                onBlur={this.handleFocusOut}/>  I have read and agree to the <a className="text-primary" onClick={this.toggle}>terms of service</a>.
                                        </label>
                                    </div>
                                    <input className="btn btn-md btn-block form-btn"
                                        value="Sign Me Up"
                                        type="submit"
                                        onClick={this.handleClick} />
                                </form>
                            </fieldset>
                                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                                <ModalHeader toggle={this.toggle}></ModalHeader>
                                <ModalBody>
                                    <h4>1. Indemnification.</h4>
                                    <p>You hereby indemnify to the fullest extent [COMPANY NAME] from and against any and all liabilities, costs, demands, causes of action, damages and expenses (including reasonable attorney's fees) arising out of or in any way related to your breach of any of the provisions of these Terms.</p>
                                    <h4>2. Severability.</h4>
                                    <p>If any provision of these Terms is found to be unenforceable or invalid under any applicable law, such unenforceability or invalidity shall not render these Terms unenforceable or invalid as a whole, and such provisions shall be deleted without affecting the remaining provisions herein.</p>
                                    <h4>3. Variation of Terms.</h4>
                                    <p>[COMPANY NAME] is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review such Terms on a regular basis to ensure you understand all terms and conditions governing use of this Website.</p>
                                    <h4>4. Assignment.</h4>
                                    <p>[COMPANY NAME] shall be permitted to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification or consent required. However, .you shall not be permitted to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.</p>
                                    <h4>5. Entire Agreement.</h4>
                                    <p>These Terms, including any legal notices and disclaimers contained on this Website, constitute the entire agreement between [COMPANY NAME] and you in relation to your use of this Website, and supersede all prior agreements and understandings with respect to the same.</p>
                                    <h4>6. Governing Law & Jurisdiction.</h4>
                                    <p>These Terms will be governed by and construed in accordance with the laws of the State of [STATE], and you submit to the non-exclusive jurisdiction of the state and federal courts located in [STATE] for the resolution of any disputes.</p>
                            </ModalBody>
                                <ModalFooter>
                                    <Button className="form-btn-b" onClick={this.toggle}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
            )
        }
    }

export default Signup;