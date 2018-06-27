import React, {Component} from 'react';

class NoMatch extends Component {
    render() {
        return (
            <div>
                {/* 404 page */}
                <div className="row">
                    <div className="col-md-12 text-center">
                        <div className="error-template">
                            <h1>
                                Oops!</h1>
                            <h2>
                                404 Not Found</h2>
                            <div className="error-details">
                                Sorry, an error has occured, Requested page not found!
                            </div>
                            <div className="error-actions mt-4">
                                <a href="/" className="btn form-toggle">
                                Take Me Home  <br/>
                                    <span className="glyphicon glyphicon-home" role="img" aria-labelledby="house glyph icon" style={{"fontSize" : "80px"}}>🏚️</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NoMatch;