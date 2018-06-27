import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import API from '../../utils/API';
import list from '../../categoryList';
import './Search.css';


class Search extends Component {
    constructor(props){
        super(props);

        this.state = {
            products: [],
            search:props.location.search ? this.decodeUrl(props.location.search.split('=')) : "",
            category:props.location.state ? props.location.state.category :
                window.location.pathname.substr(window.location.pathname.lastIndexOf('/')+1,
                window.location.pathname.indexOf('?') >-1 ?
                window.location.pathname.indexOf('?')-window.location.pathname.lastIndexOf('/') :
                window.location.pathname.length - window.location.pathname.lastIndexOf('/')-1),
            update:props.location.state ? props.location.state.load : false //used to prevent a loop
        }
    }

    //function to decode the url for the search parameters
    decodeUrl(queryString){
        return decodeURIComponent(queryString[1]).trim();
    }

    componentDidMount() {
       this.loadSearchProds();
    }

    componentDidUpdate(){
        //this if is to prevent a loop
        if(!this.state.update)
            this.loadSearchProds();
    }

    componentWillReceiveProps(nextProps){
        let values = nextProps.location.search.split('=');
        values = this.decodeUrl(values);

        let category = nextProps.location.state ? nextProps.location.state.category :
                window.location.pathname.substr(window.location.pathname.lastIndexOf('/')+1,
                window.location.pathname.indexOf('?') >-1 ?
                window.location.pathname.indexOf('?')-window.location.pathname.lastIndexOf('/') :
                window.location.pathname.length - window.location.pathname.lastIndexOf('/')-1);

        let update = nextProps.location.state ? nextProps.location.state.load : false;

        this.setState(
            {
                search:values,
                category:category,
                update: update
            }
        )
    }

    loadSearchProds = () => {
        let category = list[this.state.category.substr(0,1).toUpperCase()+this.state.category.substr(1)];

        if(Array.isArray(category))
            category = category.join(",");
        else if(!category)
            category = this.state.category;

        API.getProdCategorySearch(category,this.state.search)
            .then( res => {
                this.setState({products: res.data,update:true})
            })
            .catch(err => console.log(err))
    }

    render() {
        let keys = Object.keys(list);

        return (
            <div>                
                {this.state.products.map((p,i) => (
                    i === 0 || p.category !== this.state.products[i-1].category ?

                        <div key={"p_"+(i+1)} className="row card card-area form-area mb-5">

                            {/*figures out the header name*/}
                            {keys.map((k,i) => (
                                list[k] === p.category ?
                                <h4 className="card-header text-center form-header" key={"h_"+i}>{k}</h4>
                                :null
                            ))}

                            <div className="col-12 p-5">
                                <div className="row  justify-content-center">
                                {/* <div className="row  justify-content-around"> */}

                                    {this.state.products.map((p2,j) => (
                                        p2.category === p.category ?

                                        <div  key={"p2_"+(j+1)} className="card m-2">
                                            <div className="card-block">
                                                <Link to={`/product/${p2.id}`} >
                                                    <img className="card-img search-image" src={p2.images[0].image} alt=""/>
                                                    <div className="card-img-overlay search-img-overlay">
                                                        <p className="card-text">{p2.prodName}</p>
                                                    </div>
                                                </Link>  
                                            </div>
                                        </div>

                                    :null))}
                                
                                </div>
                            </div>
                        </div>
                    :
                    null
                ))}

            </div>

        )
    }
}

export default Search;