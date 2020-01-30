import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { pushUrl } from '../Redux/actionCreators';
import Loader from '../Components/LoaderComponent';
import { createOffer } from '../Functions/axios';

import '../css/Register.css';

class Sell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", description: "", price: 0,
            error: null, loader: false, redirect: false
        }
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    onSellSubmit = (e) => {
        e.preventDefault();
        this.setState({ loader: true });
        createOffer({
            name: this.state.name.trim().split(" "),
            description: this.state.description.trim().split(" "),
            price: this.state.price
        })
            .then(res => {
                this.props.info(res.data)
            })
            .catch(er => {
                console.log(er);
                this.setState({ error: er.response?.data || er.message });
                setTimeout(() => {
                    if (er.response?.status === 403) {
                        this.setState({ redirect: true });
                        this.props.pushUrl("/sell");
                    }
                }, 1500)
            })
            .finally(() => this.mounted ? this.setState({ loader: false }) : null);
    }

    render() {
        if (this.state.redirect)
            return <Redirect to="/login" />
        else if (this.state.loader)
            return <Loader />
        return (
            <form onSubmit={this.onSellSubmit} className="col-12 col-md-10 offset-lg-1 col-lg-9">
                <span className="text-danger">{this.state.error}</span>
                <h1>Create an offer</h1>
                <div className="form-group">
                    <label htmlFor="name">Name: </label>
                    <input type="text" className="form-control" id="name" placeholder="name"
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description: </label>
                    <input type="text" className="form-control" id="description" placeholder="description"
                        value={this.state.description}
                        onChange={(e) => this.setState({ description: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price: </label>
                    <input type="number" className="form-control" id="price" placeholder="price"
                        value={this.state.price}
                        onChange={(e) => this.setState({ price: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn-block btn-success font-weight-bolder">Create an offer</button>
            </form>
        );
    }
}

export default connect(null, {
    pushUrl
})(Sell);
