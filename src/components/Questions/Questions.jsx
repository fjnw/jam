import React, {Component} from 'react';
import moment from 'moment';
import API from '../../utils/API';
import Answers from '../Answers';
import './Questions.css';


class Questions extends Component {
    constructor(props){
        super(props);

        this.state = {
            prodId: props.productId,
            userId: props.userId || null,
            questions: [],
            socket: props.socket,
            userQuestion: ""
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            prodId:nextProps.productId,
            userId: nextProps.userId,
            socket: nextProps.socket
        });
    }

    componentWillMount() {
        if(this.state.prodId)
            this.loadQs();
    }

    componentDidMount() {
        this.receive();
    }

    //promise function to get user info for a question
    getUs = (q) =>{
        return new Promise(function(resolve, reject){
            API.getUser(q.userId)
            .then(res => {
                if(res.data)
                    q.userInfo = res.data[0];
                else
                    q.userInfo = {}
                return resolve(q);
            })
            .catch(function(error){
                return reject(error);
            });
        });
    }

    //function for loading user info
    loadQs = () => {
        let obj = this;

        API.getQuestions(this.state.prodId)
        .then( res => {
            let questions = res.data;

            //generates an array of the promises
            let qPromises = [];
            for(let i in questions){
                qPromises.push(this.getUs(questions[i]))
            }

            //runs through all the promises
            Promise.all(qPromises)
                .then(function(results){
                    obj.setState({questions:results});
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }

    //function get 1 question
    loadSpecificQuestion = (questionId) => {
        let obj = this;
        if(obj.state.prodId){
            API.getSpecificQuestion(questionId, obj.state.prodId)
            .then( res => {
                let question = res.data[0];
                this.getUs(question)
                .then(results => {
                    let Qs = [
                        ...this.state.questions,
                        results
                    ];
                    obj.setState({questions:Qs,userQuestion:""});
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
    }

    //function that is used when there is a change on an input
    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]:value
        });
    }

    //function to submit an answer
    submitQuestion = (event) => {
        event.preventDefault();
        if(this.state.userQuestion && this.state.userQuestion !== "")
            this.state.socket.emit('question',
                {prodId:this.state.prodId,
                 userId:this.state.userId,
                 question:this.state.userQuestion,
                 room: this.state.prodId
                }
            );
    }

    //function to receive socket messages
    receive = () => {
        this.state.socket.on('question', (msg) => {
            if(msg.msg === 'success'){
                this.loadSpecificQuestion(msg.questionId);
            }
            else
                console.log(msg)
        });
    }

    render() {
        return (
            <div>
                {/* question answer */}
                <div className="form-group">
                    <div className="col-12">
                        <div className="card  card-area">
                            <h4 className="card-header form-header">Q&A</h4>
                            <div className="card-block">
                                <div id="accordion-qa" className="">
                                    {this.state.questions.map((q,i) => 
                                        <div key={i+1} className="border-bottom">
                                            <div className="card-header accordion-header">
                                                <blockquote className="blockquote form-text" data-toggle="collapse" data-target={`#${i+1}`} aria-expanded="true" aria-controls="collapseOne">
                                                        <h5>{q.note}</h5> 
                                                        <footer className="blockquote-footer float-left">{q.userInfo ? q.userInfo.userName : null}, {moment(q.createTs).format('LLL')}</footer>
                                                </blockquote>
                                                <br/>
                                            </div>
                                            <div id={i+1} className={i===0?"collapse":"collapse"} data-parent="#accordion-qa">
                                                <Answers questionId={q.id} userId={this.state.userId} socket={this.state.socket} productId={this.state.prodId}/>
                                            </div> {/*  -accordian content */}
                                        </div>
                                    )}
                                </div> {/*  -accordian-qa */}
                                {this.state.userId ?
                                    <div key={"qi"} className="card-footer accordion-footer">
                                        {/* question button */}
                                        <form className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-btn-b" id="ask-label">Ask</span>
                                                </div>
                                                <input className="form-control form-input" name="userQuestion" value={this.state.userQuestion} onChange={this.handleChange}/> 
                                                <div className="input-group-append">
                                                    <button className="btn btn-md btn-block form-btn" type="submit" onClick={this.submitQuestion}>Submit</button>
                                                </div>
                                            </div>  {/*  -input-group */}
                                        </form> {/*  -form-group */}
                                    </div>
                                :null}
                            </div> {/* -card-block */}
                        </div> {/*  -card */}
                    </div> {/* -col-12 */}
                </div> {/* -row */}

            </div>
        )
    }
}

export default Questions;