/* eslint-disable no-control-regex */
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { login } from '../Functions/axios';
import { info, popUrl } from '../Redux/actionCreators';
import Loader from '../Components/LoaderComponent';
import storage from '../Functions/userStorage';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../css/Register.css';
import "../fontello/css/fontello.css";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.getInfo.email || "", password: this.props.getInfo.password || "", checked: false,
            error: this.props.getInfo.error || null,
            loader: false, redirect: false
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    onLoginSubmit = async (e) => {
        e.preventDefault();
        if (!(this.state.password && this.state.email))
            return;
        this.setState({ error: null, loader: true });
        login({
            email: this.state.email,
            hash: this.state.password
        })
            .then(res => {
                this.props.info({
                    route: "/account"
                });
                storage().setItem('x-auth-token', res.headers['x-auth-token']);
                storage().setItem('id', res.data._id);
                storage().setItem('saldo', res.data.saldo);
                this.setState({ redirect: this.props.returnUrl || "/user" });
                popUrl();
            })
            .catch(er => {
                console.log('er :', er);
                if (er.response)
                    this.setState({ error: er.response.data });
                else
                    this.setState({ error: er.messsage });
            })
            .finally(() => this.mounted ? this.setState({ loader: false }) : null);
    }

    storageManage = (e) => {
        const { checked } = e.target;
        this.setState({ checked });
        if (checked)
            localStorage.setItem('userStorage', 'local');
        else
            localStorage.setItem('userStorage', 'session');
    }

    render() {
        if (this.state.redirect)
            return <Redirect to={this.state.redirect} />
        else if (this.state.loader)
            return <Loader />
        return (
            <>
                <form onSubmit={this.onLoginSubmit} className="col-12 col-md-7 offset-lg-1 col-lg-6">
                    {this.state.error ? <span className="alert-danger m-2">{this.state.error}</span> : null}
                    <div className="form-group">
                        <label htmlFor="email" className="d-block">Email address</label>
                        <input type="email" className="form-control d-inline-block" id="email" placeholder="email@example.com" aria-describedby="emailHelp"
                            value={this.state.email}
                            onChange={(e) => this.setState({ email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="d-block">Password </label>
                        <input type="password" className="form-control d-inline-block" id="password" placeholder="********"
                            value={this.state.password}
                            onChange={(e) => this.setState({ password: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="checkbox"
                                checked={this.state.checked}
                                onChange={this.storageManage}
                            />
                            Remember me
                            </label>
                    </div>
                    <button type="submit" className="btn btn-danger">Log in</button>
                </form>
                <div className="col-12 col-md-3 mt-4 mt-md-3">
                    <Link to="/register">
                        <div className="btn btn-block btn-dark text-center text-white">New Member?<br /> Register now!</div>
                    </Link>
                </div>
            </>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        getInfo: store.info,
        returnUrl: store.urlQueue
    };
}

export default connect(mapStoreToProps, { info })(Login);