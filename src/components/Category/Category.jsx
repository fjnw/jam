import React, {Component} from 'react';
import { Route } from 'react-router-dom';

import list from '../../categoryList';

class Category extends Component {
    constructor(props){
        super(props);

        this.state = {
            select: "all",
            search: "",
            searchPath:"All"
        }
    }

    //function that is used when there is a change on select
    handleSelectChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        let path = event.target.options[event.target.selectedIndex].getAttribute('path');
        path = path.split(" ").join(""); //removes the spaces

        this.setState({
            [name]:value,
            searchPath:path
        });
    }

    //function that is used when there is a change on an input
    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]:value
        });
    }

    //function that generates a list of options from a specific formatted JSON
    getList(){
        let keys = Object.keys(list);

        return(
            <select className="form-control btn btn-sm navbar-category-dropdown" name="select" onChange={this.handleSelectChange}>
                {/* category dropdown */}
                <option value="all" path="All">All Categories</option>
                <option className="select-hr" disabled/>
                {keys.map((ele, i) => {
                    if(Array.isArray(list[ele]) && i !== 0)
                        return(
                            [<option key={i+"_hr"} className="select-hr" disabled/>,
                            <option key={i} path={ele} value={list[ele]}>{ele}</option>]
                        )
                    else
                        return <option key={i} path={ele} value={list[ele]}>{ele}</option>
                })}
            </select>
        )
    }

    render() {
        return (
            <div>
                <div className="form-inline float-right">
                <Route render={({history})=>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        history.push(`/search/${this.state.searchPath}?search=${encodeURIComponent(this.state.search)}`,
                        {category:this.state.select,load:false})}
                    }>

                        <div className="btn-group">
                            {/* category drop down */}
                            {this.getList()}
                        </div>
                        {/* search field */}
                            <input className="form-control form-control-sm navbar-search"
                                id="navbar-search-input"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                name="search"
                                onChange={this.handleChange}
                            />
                        {/* search button */}
                        <Route render={({history})=>
                            <button
                                className="btn btn-sm my-2 my-sm-0 navbar-search"
                                id="navbar-search-btn"
                                type="submit"
                                onClick={() => {history.push(`/search/${this.state.searchPath}?search=${encodeURIComponent(this.state.search)}`, 
                                    {category:this.state.select,load:false})}
                                }>
                                Search
                            </button>}/>
                    </form> }/>
                </div>
            </div>
        )
    }
}

export default Category;