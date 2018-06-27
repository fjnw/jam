import React, {Component} from 'react';
import moment from 'moment';
import API from '../../utils/API';

import './Answers.css';


class Answers extends Component {
    constructor(props){
        super(props);

        this.state = {
            questionId: props.questionId,
            userId: props.userId || null,
            productId: props.productId,
            answers: [],
            socket: props.socket,
            userAnswer: ""
        }
    }

    componentDidMount(){
        this.loadAs();
        this.receive();
    }

    componentWillReceiveProps(nextProps){

        this.setState({
            questionId:nextProps.questionId,
            userId: nextProps.userId,
            productId: nextProps.productId,
            socket: nextProps.socket
        },this.loadAs);
    }

    //function that is used when there is a change on an input
    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]:value
        });
    }

    //promise function to get user info for an answer
    getUs = (a) =>{
        return new Promise(function(resolve, reject){
            API.getUser(a.userId)
            .then(res => {
                if(res.data)
                    a.userInfo = res.data[0];
                else
                    a.userInfo = {}
                return resolve(a);
            })
            .catch(function(error){
                return reject(error);
            });
        });
    }

    //function get answers
    loadAs = () => {
        let obj = this;

        if(obj.state.questionId){
            API.getAnswers(obj.state.questionId)
            .then( res => {
                let answers = res.data;
                //generates an array of the promises
                let aPromises = [];
                for(let i in answers){
                    aPromises.push(this.getUs(answers[i]))
                }

                //runs through all the promises
                Promise.all(aPromises)
                    .then(function(results){
                        obj.setState({answers:results});
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
    }

    //function get 1 answer
    loadSpecificAnswer = (answerId) => {
        let obj = this;
        if(obj.state.questionId){
            API.getSpecificAnswer(obj.state.questionId, answerId)
            .then( res => {
                if(res.data.length > 0){
                    let answers = res.data[0];
                    this.getUs(answers)
                    .then(results => {
                        let As = [
                            ...this.state.answers,
                            results
                        ];
                        obj.setState({answers:As,userAnswer:""});
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
        }
    }

    //function to submit an answer
    submitAnswer = (event) => {
        event.preventDefault();
        if(this.state.userAnswer && this.state.userAnswer !== "")
            this.state.socket.emit('answer',
                {questionId:this.state.questionId,
                 userId:this.state.userId,
                 answer:this.state.userAnswer,
                 room: this.state.productId
                }
            );
    }

    //function to receive socket messages
    receive = () => {
        this.state.socket.on('answer', (msg) => {
            if(msg.msg === 'success')
                this.loadSpecificAnswer(msg.answerId);
            else
                console.log(msg)
        });
    }

    render() {
        return (
            [<div key={"ap_"+this.state.questionId} className="list-group list-group-flush px-4 mb-4">
                {this.state.answers.map((a,j) =>
                    <div key={j+1} className="list-group-item form-text">
                        <div>{a.note}</div>
                        <footer className="blockquote-footer float-left">{a.userInfo ? a.userInfo.userName : null}, {moment(a.createTs).format('LLL')}</footer>
                    </div>
                )}
            </div>,
            this.state.userId ?
                <div key={"ai"} className="card-footer accordion-footer">
                    {/* new answer */}
                    <form className="form-group px-4">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text form-btn-b" id="answer-label">Answer</span>
                            </div>
                            <input className="form-control form-input" name="userAnswer" value={this.state.userAnswer} onChange={this.handleChange}/> 
                            <div className="input-group-append">
                                <button className="btn btn-md btn-block form-btn" type="submit" onClick={this.submitAnswer}>Submit</button>
                            </div>
                        </div>  {/*  -input-group */}
                    </form> {/*  -form-group */}
                </div>
            :null]
        )
    }
}

export default Answers;
