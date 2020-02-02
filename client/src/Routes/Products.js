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
            redirect: false, loader: true, error: null,
            keywords: ""
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.searchProducts();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    searchProducts = () => {
        this.setState({ loader: true });
        this.props.generateProductsList()
            .catch(er => {
                console.log('er :', er);
                if (er.response)
                    this.setState({ error: er.response.data });
                else
                    this.setState({ error: er.messsage });
            })
            .finally(() => this.mounted ? this.setState({ loader: false }) : null );
    }

    render() {
        if (this.state.redirect)
            return <Redirect to={this.state.redirect} />
        return (
            <>
                <div className="d-none d-sm-block col-sm-3 col-md-2 text-wrap filters">
                    Filtry<br />
                    assssss ssssss  ssss sss  sssssssss ss   sssssssss sss  ssss ssss ssssssssssssss<br />
                    a ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssssssss<br />
                    a ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssssssss<br />
                    a ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssssssss<br />
                </div>
                <div className="col-12 col-sm-9 col-md-8">
                    <form className="searchbar">
                        <input type="text" placeholder="Search for product" value={this.state.keywords}
                            onChange={(e) => this.setState({ keywords: e.target.value })} />
                        <button onClick={this.searchProducts} className="btn-danger ml-2"><i className="icon-search" /></button>
                    </form>
                    {this.state.loader ? <Loader /> : <List list={this.props.productsList} />}
                    <div className="pagination mt-4">
                        Paginacja<br />
                        a ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssss ssssssss<br />
                    </div>
                </div>
            </>
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