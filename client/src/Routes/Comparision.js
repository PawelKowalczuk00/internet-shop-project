import React from 'react';
import { connect } from 'react-redux';

import { selectProduct, generateProductsList } from '../Redux/actionCreators';

//import './css/Home.css';

class Comparision extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.generateProductsList();
    }

    render() {
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
    console.log('store :', store);
    return {
        productsList: store.list.list,
        productsCount: store.list.count,
        info: store.info
    };
}

export default connect(mapStoreToProps, {
    generateProductsList
})(Comparision);
