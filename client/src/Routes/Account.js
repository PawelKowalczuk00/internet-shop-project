import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { info } from '../Redux/actionCreators';
import Loader from '../Components/LoaderComponent';
import storage from '../Functions/userStorage';
import { account } from '../Functions/axios';

//import './css/Account.css';

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mainLoad: false, activeOffersLoad: false, transactionHistoryLoad: false,
            main: null, activeOffers: null, transactionHistory: null
        };
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidMount() {
        this.mounted = true;
        this.setState({ mainLoad: true })
        account()
            .then(res => {
                console.log('res.data :', res.data);
                this.setState({ main: res.data });
            })
            .catch(er => {
                console.log('er :', er);
                this.props.info({
                    route: "/login",
                    error: er.response?.data || er.message
                });
                this.setState({ redirect: true })
            })
            .finally(() => this.mounted ? this.setState({ mainLoad: false }) : null);
    }

    render() {
        if (this.state.redirect)
            return <Redirect to="/user" />
        else if (this.state.mainLoad)
            return <Loader />
        return (
            <div>
                <h1>{JSON.stringify(this.state.main)}</h1>
            </div>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        info: store.info
    };
}

export default connect(mapStoreToProps, { info })(Account);
