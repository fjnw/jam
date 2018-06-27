import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import jwt from 'jsonwebtoken';
import '../Product.css';
import './ProductNew.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import API from '../../utils/API';
import list from '../../categoryList';


class ProductNew extends Component {

    constructor (props) {
        super(props)

        this.state = {
            cert: props.cert,
            prodName: {value:"", isValid: true, message:[], isRequired: true},
            category: {value:"", isValid: true, message:[], isRequired: true},
            description: {value:"", isValid: true, message:[], isRequired: true},
            startingPrice: {value: 0, isValid: true, message:[], isRequired: true},
            location: {value:"", isValid: true, message:[], isRequired: false},
            returnPolicy: {value:"", isValid: true, message:[], isRequired: true},
            endTimestamp: {value:moment(), isValid: true, message:[], isRequired: true},
            sellerId: props.userId,
            images: [{
                val: "",
                type: "",
                file: null
            }],
            imageCount: 1,
            success:false,
            newProdId:""
        };
    }

    componentWillMount() {
        let obj = this;
        let token = JSON.parse(sessionStorage.getItem("JamBid"));
        if(token){
            if(token.token)
                jwt.verify(token.token, obj.state.cert, (err, decode) => {
                if(err) console.log("err",err);

                if(decode)
                    obj.setState({sellerId:decode.userId});
                });
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({sellerId:nextProps.userId});
    }
      
    //function that is used when there is a change on an input
    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        let obj = this.state[name];

        obj.value = value;

        this.setState({
            [name]:obj
        });
    }

    //function that is used when there is a change on an input
    handleImageChange = (event) => {
        const name = parseInt(event.target.name, 10);
        let value = event.target.value;
        const type = event.target.getAttribute('imagetype');
        let file = null;
        
        if(type === 'file')
            file = event.target.files[0];
        
        //uses non-mutator method to insert the change into the array
        let obj = this.state.images;
        obj = [
            ...obj.slice(0,name),
            {val:value, type:type, file:file},
            ...obj.slice(name+1)
        ]

        this.setState({
            images:obj
        });
    }

    //function that is used when there is a change on date picker
    handleDateChange = (event) => {
        let obj = this.state.endTimestamp;
        obj.value = event;

        this.formValidation('endTimestamp');

        this.setState({
            endTimestamp:obj
        });
    }

    //function to choose to add more than 1 image
    handleImageCount = (event) => {
        event.preventDefault();

        const value = this.state.imageCount +1;

        if(value < 5){
            //uses non-mutator method to insert the change into the array
            let obj = this.state.images;
            obj = [
                ...obj.slice(0,value),
                {val: "",type: "",file: null}
            ]

            this.setState({
                imageCount:value,
                images:obj
            })
        }
    }

    //function handle changing image type
    handleImageTypeChange = (event) =>{
        event.preventDefault();

        const type = event.target.getAttribute('imagetype');
        const name = parseInt(event.target.name, 10);
        
        //uses non-mutator method to insert the change into the array
        let obj = this.state.images;
        obj = [
            ...obj.slice(0,name),
            {val:"", type:type, file:null},
            ...obj.slice(name+1)
        ]
 
        this.setState({
            images:obj
        })
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

    //function for onBlue (cursor leaving target)
    handleFocusOut = (event) => {
        const name = event.target.name;

        if(this.state[name].hasOwnProperty('isValid'))
            this.formValidation(name);
    }

    //function to perform the validation on the input fields
    formValidation = (name) => {
        let valid = true;
        let obj = this.state[name];
        let errorMsg = [];

        if (name === "prodName"){
            if (this.state[name].isRequired && !this.state[name].value){
                errorMsg.push(`Product name is required.`);
                valid = false;
            }
            else{
                // if(!this.state[name].value.match(/^[a-zA-Z0-9_.-]*$/)) {
                //     errorMsg.push("Use letters and numbers for Username");
                //     valid = false;                
                // }
            }
        }
        else if(name === "category"){
            if(this.state[name].isRequired && !this.state[name].value){
                errorMsg.push(`Category field is required.`);
                valid = false;
            }
        }
        else if(name === "description"){
            if(this.state[name].isRequired && !this.state[name].value){
                errorMsg.push(`Description is required.`);
                valid = false;
            }
            else{
                if(this.state[name].value.length > 1000){
                    errorMsg.push(`Description is longer than 1000 characters.`);
                    valid = false;
                }
            }
        }
        else if(name === "startingPrice"){
            if(this.state[name].isRequired && !this.state[name].value){
                errorMsg.push(`Starting price is required.`);
                valid = false;
            }
            else{
                if(this.state[name].value < 0){
                    errorMsg.push(`Starting price must be greater than $0.`);
                    valid = false;
                }
            }
        }
        else
         if(name === "location"){
            if(this.state[name].isRequired && !this.state[name].value){
                errorMsg.push(`Location is required.`);
                valid = false;   
            }
        }
        else if(name === "returnPolicy"){
            if(this.state[name].isRequired && !this.state[name].value){
                errorMsg.push(`Return policy is required`);
                valid = false;   
            }
            else{
                if(this.state[name].value.length > 1000){
                    errorMsg.push("Return policy cannot be longer than 1000 characters.");
                    valid = false;
                }
            }
        }
        else if(name === "endTimestamp"){
            if(this.state[name].isRequired && !this.state[name].value){
                errorMsg.push("Ending timestamp is required.");
                valid = false;
            }
            else if(this.state[name].value.isSameOrBefore(moment())){
                errorMsg.push("Ending timestamp must be in the future.");
                valid = false;
            }
        }

        obj.isValid = valid;
        obj.message = errorMsg;

        this.setState({[name]:obj})
    }

    //function to submit the new prod info
    handleSubmit =(event) =>{
        event.preventDefault();
        let obj = this;

        //loops through the state JSON
        for(let i in obj.state){
            if(obj.state[i].hasOwnProperty('isValid'))
                obj.formValidation(i);
        }

        if(!this.checkForErrors()){
            API.insertNewProd({
                prodName: this.state.prodName.value,
                category: this.state.category.value,
                description: this.state.description.value,
                startingPrice: this.state.startingPrice.value,
                location: this.state.location.value,
                endTimestamp: this.state.endTimestamp.value,
                sellerId: this.state.sellerId,
                images: this.state.images,
                returnPolicy: this.state.returnPolicy.value
            })
            .then(res => {
                obj.setState({newProdId:res.data,success:true});
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    //function that generates a list of options from a specific formatted JSON
    getList(){
        let keys = Object.keys(list);

        return(
            <select className='form-control category-dropdown'
            defaultValue=""
            name="category"
            style={{margin:"3px",borderRadius:0}}
            onChange={this.handleChange}
            onBlur={this.handleFocusOut}>
                {/* category dropdown */}
                <option disabled value=""></option>
                {keys.map((ele, i) => {
                    if(Array.isArray(list[ele]) && i !== 0)
                        return(
                            [<option key={i+"_hr"} className="select-hr" disabled/>,
                            <option key={i} path={ele} value={list[ele]} disabled={Array.isArray(list[ele])?true:false}>{ele}</option>]
                        )
                    else
                        return <option key={i} path={ele} value={list[ele]} disabled={Array.isArray(list[ele])?true:false}>{ele}</option>
                })}
            </select>
        )
    }

    //function to generate the image upload section
    getHtmlImageUpload =() =>{
        let obj = [];

        for(let i = 0; i < this.state.imageCount; i++){
            obj.push([<div  key={`img_${i}`} className="form-group form-input">
                                <div className="input-group">
                                    <div className="input-group-prepend file-toggle w-100">
                    
                                        <ul className="nav nav-pills form-toggle list-group file-toggle" role="tablist">
                                            <li className="nav-item ">
                                                <a name={i}
                                                    imagetype="file"
                                                    onClick={this.handleImageTypeChange}
                                                    className="nav-link form-toggle active img-toggle-btn"
                                                    id="img-url-tab"
                                                    data-toggle="pill"
                                                    href={`#img-url_${i}`}
                                                    role="tab"
                                                    aria-selected="true">
                                                        URL
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a name={i}
                                                    imagetype="url"
                                                    onClick={this.handleImageTypeChange}
                                                    className="nav-link form-toggle img-toggle-btn"
                                                    id="img-upload-tab"
                                                    data-toggle="pill"
                                                    href={`#img-upload_${i}`}
                                                    role="tab"
                                                    aria-selected="false">
                                                        Upload
                                                </a>
                                            </li>
                                        </ul>

                                        <div  className="card-body" id="toggle-content">
                                            <div className="tab-content">
                                                {/* image URL */}
                                                <div className="tab-pane fade show active w-100" id={`img-url_${i}`} role="tabpanel" aria-labelledby="pills-image-tab">
                                                    <div className="form-group w-100">
                                                        <input className="form-control form-input url-input"
                                                            name={`${i}`}
                                                            onChange={this.handleImageChange}
                                                            value={this.state.images[i].val}
                                                            imagetype="url"
                                                            /> 
                                                    </div>
                                                </div>
                                                {/* image upload */}
                                                <div className="tab-pane fade w-100" id={`img-upload_${i}`} role="tabpanel" aria-labelledby="pills-upload-tab">
                                                    <div className="form-group w-100">
                                                        <input type="file"
                                                            className="form-control form-input"
                                                            onChange={this.handleImageChange}
                                                            value={this.state.images[i].type === 'file' ? this.state.images[i].val : ""}
                                                            name={`${i}`}
                                                            imagetype="file"
                                                            multiple/>
                                                        <small className="form-text text-muted">{`Types:  .png .jpg .jpeg <1 MB`}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                ])
            }

        return(
            obj
        )
    }


    render() {
        let keys = Object.keys(this.state);

        return (
            <div>
                {!this.state.sellerId ? <Redirect to="/"/>:null}
                {this.state.success && this.state.newProdId ? <Redirect to={`/product/${this.state.newProdId}`}/>:null}
                {this.checkForErrors() ?
                    <div className="alert alert-danger">
                        {keys.map((k,i) =>(
                            this.state[k].hasOwnProperty('message') ? 
                                this.state[k].message.map((m,j) =>(
                                    <p key={i+"_"+j}>{`* ${m}`}</p>
                                ))
                            : null
                        ))}
                    </div>
                :null}
                
                <form className="form-sign-up mt-3">
                    {/*<!-- New Product form -->*/}
                    <div className="row">

                        {/* bid pane */}
                        <div className="col-md-6 col-sm-12">
                            {/* card */}
                            <div className="card form-area">
                                <div className="card-body form-area form-shrink">
                                
                                    {/* submit form */}
                                    <div className="form-group">
                                        <button className="btn btn-md btn-block" type="submit" id="submit-btn" onClick={this.handleSubmit}>Create Ad</button>
                                    </div>

                                    {/* form */}
                                        {/* title */}
                                        <div className={this.state.prodName.isValid ? "form-group form-input" : "form-group form-input error"}>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-btn-b">Title</span>
                                                </div>
                                                <input
                                                    name="prodName"
                                                    className="form-control"
                                                    style={{borderRadius:0, border:"none"}}
                                                    type="text"
                                                    value={this.state.prodName.value}
                                                    onChange={this.handleChange}
                                                    onBlur={this.handleFocusOut}/> 
                                            </div>
                                        </div>

                                        {/* category */}
                                        <div className={this.state.category.isValid ? "form-group form-input" : "form-group form-input error"}>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-btn-b">Category</span>
                                                </div>
                                                {this.getList()}
                                            </div>
                                        </div>

                                        {/* location */}
                                        <div className={this.state.location.isValid ? "form-group form-input" : "form-group form-input error"}>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-btn-b">Location</span>
                                                </div>
                                                <input className="form-control"
                                                    style={{borderRadius:0, border:"none"}}
                                                    name="location"
                                                    value={this.state.location.value}
                                                    onChange={this.handleChange}
                                                    onBlur={this.handleFocusOut}/> 
                                            </div>
                                        </div>

                                        {/* end time */}
                                        <div className={this.state.endTimestamp.isValid ? "form-group form-input" : "form-group form-input error"}>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text input-md form-btn-b">End Time</span>
                                                </div>
                                                <DatePicker
                                                    selected={this.state.endTimestamp.value}
                                                    onChange={this.handleDateChange}
                                                    showTimeSelect
                                                    timeIntervals={30}
                                                    dateFormat="LLL"
                                                />
                                            </div>
                                        </div>

                                        {/* location */}
                                        <div className={this.state.startingPrice.isValid ? "form-group form-input" : "form-group form-input error"}>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-btn-b">Min. Bid</span>
                                                </div>
                                                <div className="input-group-prepend">
                                                    <span className="form-btn-b new-prod-dollar">$</span>
                                                </div>
                                                <input type='number'
                                                    step="0.01"
                                                    className="form-control"
                                                    style={{borderRadius:0, border:"none"}}
                                                    name="startingPrice"
                                                    value={this.state.startingPrice.value}
                                                    onChange={this.handleChange}
                                                    onBlur={this.handleFocusOut}/> 
                                            </div>
                                        </div>

                                </div> {/*  -card-body */}
                            </div> {/*  -card */}
                        </div> {/*  -card */}

                        {/* add image */}
                        <div className="col-md-6 col-sm-12">
                            <div className="card  form-area">
                                <div className="card-body  form-area">
                                    {this.state.imageCount < 4 ?
                                        <div className="form-group">
                                            <div id="ghost">
                                                <button className="btn btn-md btn-block btn-hover" type="submit" onClick={this.handleImageCount}>Add More Images</button>
                                            </div>
                                        </div>
                                    :null}
                                    <div className="form-group">
                                        {this.getHtmlImageUpload()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div> {/*  -row */}

                    {/* description */}
                    <div className="form-group">
                        <div className="col-12">
                            <div className={this.state.description.isValid ? "card" : "card error"}>
                                <h4 className="card-header form-header">Description</h4>
                                <div className="card-block">
                                    <textarea type="text"
                                        className="form-control form-textarea-e"
                                        name="description"
                                        placeholder="500 character max"
                                        value={this.state.description.value}
                                        onChange={this.handleChange}
                                        onBlur={this.handleFocusOut}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* return policy */}
                    <div className="form-group">
                        <div className="col-12">
                            <div className={this.state.returnPolicy.isValid ? "card" : "card error"}>
                                <h4 className="card-header form-header">Return Policy</h4>
                                <div className="card-block">
                                    <textarea type="text"
                                        className="form-control form-textarea-e"
                                        name="returnPolicy"
                                        placeholder="500 character max"
                                        value={this.state.returnPolicy.value}
                                        onChange={this.handleChange}
                                        onBlur={this.handleFocusOut}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default ProductNew;
