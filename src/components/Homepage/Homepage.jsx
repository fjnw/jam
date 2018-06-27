import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import Moment from 'react-moment';
import API from '../../utils/API';
import list from '../../categoryList';
import './homepage.css';

import automotiveSvg from './images/automotive.svg';
import electronicSvg from './images/electronic.svg';
import furnitureSvg from './images/furniture.svg';


class Homepage extends Component {

    constructor(props){
        super(props);

        this.state = {
            products: []
        }
    }

    componentDidMount() {
        this.loadRecentProds();
    }

    loadRecentProds = () => {
        API.getRecentProducts()
            .then( res => {
                this.setState({products: res.data})
            })
            .catch(err => console.log(err))
    }

    render() {
        return (

            <div>
                {/*<!-- Homepage -->*/}
                <div className="d-flex align-content-between flex-wrap justify-content-center">

                    <Route render={({history})=> 
                        <div className="p-2 my-flex-item" style={{cursor: "pointer"}} onClick={ () =>{history.push('/search/Automotive?search=', {category: list["Automotive"].join(",") , load:false} )}} >
                            <div className="card home-card">
                                <img className="card-image home-image" src={automotiveSvg} alt=""/>
                                <div className="card-img-overlay home-img-overlay text-center ">
                                    <span className="card-img-overlay-text home-img-overlay-text">Automotive</span>
                                </div>
                            </div>
                        </div>
                    }/>

                    <Route render={({history})=> 
                        <div className="p-2 my-flex-item" style={{cursor: "pointer"}} onClick={ () =>{history.push('/search/Electronic?search=', {category: list["Electronics"].join(",") , load:false} )}} >
                            <div className="card card-area">
                                <img className="card-image home-image" src={electronicSvg} alt=""/>
                                <div className="card-img-overlay home-img-overlay text-center">
                                    <span className="card-img-overlay-text home-img-overlay-text">Electronics</span>
                                </div>
                            </div>
                        </div>
                    }/>

                    <Route render={({history})=> 
                        <div className="p-2 my-flex-item" style={{cursor: "pointer"}} onClick={ () =>{history.push('/search/Furniture?search=', {category: list["Furniture"].join(",") , load:false} )}} >
                            <div className="card card-area">
                                <img className="card-image home-image" src={furnitureSvg} alt=""/>
                                <div className="card-img-overlay home-img-overlay text-center">
                                    <span className="card-img-overlay-text home-img-overlay-text">Furniture</span>
                                </div>
                            </div>
                        </div>
                    }/>

                </div>

                    <div className="d-flex align-content-between flex-wrap justify-content-center">
                        <div className="card card area form-area mt-5">
                            <h4 className="card-header text-center form-header">Recent Sweet Deals</h4>
                            <div className="col-12">
                                <div className="row  justify-content-center">

                                    {this.state.products.map((p,i) => (
                                        
                                        // result image and text overlay
                                        <div key={i} className="p-4 my-flex-item">
                                            <div className="card">
                                                <div className="card-block">
                                                    <Link to={`/product/${p.id}`} >
                                                        <div className="card-img search-image">
                                                                {p.images.length > 0 ?<img className="card-img search-image" src={p.images[0].image} alt=""/>:null}
                                                                <div className="card-img-overlay search-img-overlay">
                                                                    <p className="card-text">{p.prodName}</p>
                                                                </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* end timestamp */}
                                            <div className="timestamp text-center">
                                                <span>Ends: </span>
                                                <span><Moment format="MM/DD/YY LT">{p.endTimestamp}</Moment></span>
                                            </div>
                                        </div>

                                    ))}  

                                </div>   
                            </div>
                        </div>    
                    </div>

            </div>
        )
    } 
}

export default Homepage;