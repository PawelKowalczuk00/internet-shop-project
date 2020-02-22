import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { pushUrl } from '../Redux/actionCreators';
import Loader from '../Components/LoaderComponent';
import storage from '../Functions/userStorage';
import { createOffer } from '../Functions/axios';

import '../css/Register.css';
import "../fontello/css/fontello.css";

class Sell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", description: "", price: 0, picture: undefined,
            error: null, loader: false, redirect: false,
            disabled: true, badPicture: false
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.createdOffer_id = undefined;
        if (!(storage().getItem('email')))
            this.setState({ error: "You have to be logged in and verified to sell products" });
        else
            this.setState({ disabled: false })
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    onPictureChange = (e) => {
        const picture = e.target.files[0];
        if (picture.size > 5 * 1000000)
            return this.setState({ error: "Image is to big", badPicture: true });
        if (!picture.type.includes('image'))
            return this.setState({ error: "You have to select a 'png' or 'jpg' picture", badPicture: true });
        return this.setState({ picture: e.target.files[0], badPicture: false, error: null });
    }

    onResetClick = (e) => {
        e.preventDefault();
        this.setState({ picture: undefined, badPicture: false, error: null });
        e.currentTarget.previousElementSibling.value = "";
    }

    onSellSubmit = (e) => {
        e.preventDefault();
        this.setState({ loader: true });
        const form = new FormData();
        form.append('name', this.state.name.trim().toLowerCase());
        form.append('description', this.state.description.trim().toLowerCase());
        form.append('price', this.state.price);
        if (this.state.picture)
            form.append('picture', this.state.picture);
        createOffer(form)
            .then(async res => {
                this.createdOffer_id = res.data;
                this.setState({ redirect: "/selled" });
            })
            .catch(er => {
                console.log(er);
                this.setState({ error: er.response?.data || er.message });
                setTimeout(() => {
                    if (er.response?.status === 401) {
                        this.setState({ redirect: "/login" });
                        this.props.pushUrl("/sell");
                    }
                }, 1500);
            })
            .finally(() => this.mounted ? this.setState({ loader: false }) : null);
    }

    render() {
        if (this.state.redirect === "/selled")
            return <Redirect to={{
                pathname: `/selled`,
                search: "id="+this.createdOffer_id
            }}/>
        else if (this.state.redirect)
            return <Redirect to={this.state.redirect} />
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
                <div className="form-group file">
                    <label htmlFor="picture">Picture: </label><br />
                    <input onChange={this.onPictureChange} type="file" className="form-control" id="picture" />
                    <button type="button" onClick={this.onResetClick} className="reset"><i className="icon-cancel text-white" /></button>
                </div>
                <button type="submit" className="btn-block btn-success font-weight-bolder" disabled={this.state.disabled || this.state.badPicture}>Create an offer</button>
            </form>
        );
    }
}

export default connect(null, {
    pushUrl
})(Sell);
