import React from 'react';
import { connect } from 'react-redux';

import { generateProductsList } from '../Redux/actionCreators';

//import './css/Home.css';

class Products extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.generateProductsList();
    }

    render() {
        console.log('this.props :', this.props);
        return (
            <div>
                <h1>{this.props.info}</h1>
                <div>
                    {this.props.productsList.map(product => {
                        return (
                            <div><h1>{product.name}</h1></div>
                        );
                    })}
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
