import React, {Component} from 'react';
import moment from 'moment';

class TimeRemaining extends Component {
    constructor(props){
        super(props);

        this.state = {
            endTime: moment(props.time,'YYYY-MM-DDTHH:mm:ss.SSSZ'),
            setAllowBidFunc:props.setAllowBid, //function used to tell the parent component that it is ok to allow bidding
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        }
    }

    componentDidMount(){
        let obj = this;
        if(obj.state.endTime && !obj.timeInterval)
            obj.timeInterval = setInterval(()=>obj.setState(this.determineIfStillTime()),1000);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            endTime: moment(nextProps.time,'YYYY-MM-DDTHH:mm:ss.SSSZ'),
            setAllowBidFunc:nextProps.setAllowBid
        },function(){
            if(this.state.endTime && !this.timeInterval)
                this.timeInterval = setInterval(()=>this.setState(this.determineIfStillTime()),1000);
        })
    }

    componentWillUnmount(){
        clearInterval(this.timeInterval);
    }

    //function to generate the time remaining
    determineIfStillTime(){
        if(this.state.endTime){
            let current = moment();

            if(this.state.endTime.isAfter(current)){
                let remaining = this.state.endTime.diff(current)/1000;
                
                let days = Math.floor(remaining / 86400);
                remaining = remaining % 86400;

                let hours = Math.floor(remaining / 3600);
                remaining = remaining % 3600;

                let minutes = Math.floor(remaining / 60);
                let seconds = Math.floor(remaining % 60);

                this.state.setAllowBidFunc(true);

                this.setState({
                    days: days,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds
                })
            }
            else
                this.state.setAllowBidFunc(false);
        }
    }

    render() {
        let current = moment();
        return(
            this.state.endTime ?
                this.state.endTime.isAfter(current)?
                <div>
                    {this.state.days > 0 ? `${this.state.days} d, `: null}
                    {this.state.hours > 0 ? `${this.state.hours} h, `: null}
                    {this.state.minutes > 0 ? `${this.state.minutes} m, `: null}
                   {this.state.seconds} s
                </div>
                :
                <div className="text-muted">Sold!</div>
            :
            <div className="text-muted">Not Available.</div>
        )
    }
}

export default TimeRemaining;