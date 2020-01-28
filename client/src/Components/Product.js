import React from 'react';
import { connect } from 'react-redux';

//import './css/Product.css';

const Product = () => {
    
}

const mapStoreToProps = (store) => {
    return {
        selectedProduct: store.selectOne,
        info: store.info
    };
}

export default connect(mapStoreToProps)(Product);
