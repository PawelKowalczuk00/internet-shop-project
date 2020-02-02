import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';

import Loader from '../Components/LoaderComponent';
import { removeFromBasket } from '../Redux/actionCreators';

import '../css/Basket.css';

class Basket extends React.Component {

    removeFromBasket = (id) => {
        this.props.removeFromBasket(id);
        this.forceUpdate();
    }

    render() {
        return (
            <>
                {JSON.stringify(this.props.basket)}
            </>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        basket: store.basket,
    };
}

export default connect(mapStoreToProps, {
    removeFromBasket
})(Basket);