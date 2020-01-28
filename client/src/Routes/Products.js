import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Loader from '../Components/LoaderComponent';
import { generateProductsList } from '../Redux/actionCreators';
import List from '../Components/List';

import '../css/Products.css';

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false, loadig: true, error: null,
            keywords: ""
        };
    }

    componentDidMount() {
        this.props.generateProductsList()
            .finally(() => this.setState({ loadig: false }));
    }

    search = () => {

    }

    render() {
        if (this.state.redirect)
            return <Redirect to={this.state.redirect} />
        return (
            <div className="container">
                <div className="row">
                    <div className="d-none d-md-block col-md-4 offset-lg-1 col-lg-3 offset-xl-2 col-xl-2">
                        Filtry<br />
                        assssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss<br />
                        assssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss<br />
                        assssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss<br />
                        assssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss<br />
                    </div>
                    <form className="col-12 col-md-8 ml-md-3">
                        <input type="text" placeholder="Search for product" value={this.state.keywords}
                            onChange={(e) => this.setState({ keywords: e.target.value })} />
                        <button onClick={this.search} className="btn-danger"><i className="icon-search" /></button>
                    </form>
                    <div className="col-12 offset-md-4 col-md-8">
                        {this.state.loader ? <Loader /> : <List list={this.props.productsList} />}
                    </div>
                    <div className="col-12 offset-md-4 col-md-8">
                        Paginacja<br />
                        assssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss<br />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        productsList: store.list.list,
        productsCount: store.list.count,
        info: store.info
    };
}

export default connect(mapStoreToProps, {
    generateProductsList
})(Products);
