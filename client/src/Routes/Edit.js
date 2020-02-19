import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Loader from '../Components/LoaderComponent';
import storage from '../Functions/userStorage';
import { editOffer } from '../Functions/axios';

import '../css/Register.css';
import "../fontello/css/fontello.css";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.product.name.join(" "), description: this.props.product.description.join(" "), price: this.props.product.price,
            error: null, loader: false, redirect: false,
            disabled: false, badPicture: false
        }
    }

    componentDidMount() {
        this.mounted = true;
        if (!(storage().getItem('saldo')) || this.props.product.seller?.email !== storage().getItem('email'))
            this.setState({ error: "You have to be logged in and verified to edit products" });
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

    onEditSubmit = (e) => {
        e.preventDefault();
        this.setState({ loader: true });
        const form = new FormData();
        form.append('name', this.state.name.trim().toLowerCase());
        form.append('description', this.state.description.trim().toLowerCase());
        form.append('price', this.state.price);
        if (this.state.picture)
            form.append('picture', this.state.picture);
        editOffer(form, this.props.product._id)
            .then(async res => {
                this.setState({ redirect: "/edited" });
            })
            .catch(er => {
                console.log(er);
                this.setState({ error: er.response?.data || er.statusText });
            })
            .finally(() => this.mounted ? this.setState({ loader: false }) : null);
    }

    render() {
        if (this.state.redirect === "/edited")
            return <Redirect to={{
                pathname: `/product`,
                search: "id=" + this.props.product._id
            }} />
        else if (this.state.loader)
            return <Loader />
        return (
            <div className="col-12 col-md-10 offset-lg-1 col-lg-9">
                <form onSubmit={this.onEditSubmit}>
                    <span className="text-danger">{this.state.error}</span>
                    <h1>Edit existing offer</h1>
                    <div className="form-group">
                        <label htmlFor="name">Name: </label>
                        <input type="text" className="form-control text-capitalize" id="name" placeholder="name"
                            value={this.state.name}
                            onChange={(e) => this.setState({ name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description: </label>
                        <input type="text" className="form-control text-capitalize" id="description" placeholder="description"
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
                        <label htmlFor="picture">Picture: (Leave Blank if you don't wish to change picture)</label><br />
                        <input onChange={this.onPictureChange} type="file" className="form-control" id="picture" />
                        <button type="button" onClick={this.onResetClick} className="reset"><i className="icon-cancel text-white" /></button>
                    </div>
                    <button type="submit" className="btn-block btn-success font-weight-bolder" disabled={this.state.disabled || this.state.badPicture}>Edit an offer</button>
                </form> <br />
                <p className="m-3 ml-5">Previous picture:</p>
                <img className="ml-5" src={`https://internet-shop-project-pk2020.herokuapp.com/prodImg/${this.props.product.imgUrl}`} alt="Product" />
            </div>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        product: store.selectOne
    };
}

export default connect(mapStoreToProps)(Edit);