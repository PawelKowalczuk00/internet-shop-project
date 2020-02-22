/* eslint-disable no-control-regex */
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { register } from '../Functions/axios';
import { info } from '../Redux/actionCreators';
import Loader from '../Components/LoaderComponent';

import '../css/Register.css';
import "../fontello/css/fontello.css";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", surname: "", email: "", password: "", passwordRepeat: "", gender: "",
            error: this.props.getInfo.error || null,
            nameHelper: null, surnameHelper: null, emailHelper: null, genderHelper: null, passwordHelper: null, compareHelper: null,
            loader: false, redirect: false
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    onRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!(
            this.validateInput(this.state.name, "Name", 2, 25, /^([^0-9]*)$/) &&
            this.validateInput(this.state.surname, "Surname", 2, 40, /^([^0-9]*)$/) &&
            this.validateInput(this.state.email, "Email", 0, 80, /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) &&
            this.validateInput(this.state.password, "Password", 8, 100, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/) &&
            this.comparePasswords() &&
            this.checkGender()

        ))
            return;
        this.setState({ error: null, loader: true });
        register({
            name: this.state.name,
            surname: this.state.surname,
            email: this.state.email,
            hash: this.state.password,
            gender: this.state.gender
        })
            .then(res => {
                this.props.info({
                    route: "/login",
                    email: this.state.email,
                    password: this.state.password,
                });
                this.setState({ redirect: true });
            })
            .catch(er => {
                console.log('er :', er);
                if (er.response)
                    this.setState({ error: er.response.data });
                else
                    this.setState({ error: er.message || er.statusText });
            })
            .finally(() => this.mounted ? this.setState({ loader: false }) : null);
    }

    onNameChange = (e) => {
        const name = e.target.value;
        this.setState({ name });
        this.validateInput(name, "Name", 2, 25, /^([^0-9]*)$/);
    }
    onSurnameChange = (e) => {
        const surname = e.target.value;
        this.setState({ surname });
        this.validateInput(surname, "Surname", 2, 40, /^([^0-9]*)$/);
    }
    onEmailChange = (e) => {
        const email = e.target.value;
        this.setState({ email });
        this.validateInput(email, "Email", 0, 80, /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);
    }
    onPasswordChange = (e) => {
        const password = e.target.value;
        this.setState({ password });
        this.validateInput(password, "Password", 8, 100, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
    }
    onPasswordRepeatChange = (e) => {
        const passwordRepeat = e.target.value;
        this.setState({ passwordRepeat });
        this.comparePasswords(passwordRepeat);
    }
    onGenderChange = (e) => {
        this.setState({ gender: e.target.value, genderHelper: null })
    }

    validateInput = (value, valueDisplay, min, max, regexp) => {
        if (value.length < min)
            this.setState({ [`${valueDisplay.toLowerCase()}Helper`]: `${valueDisplay} has to be longer than ${min} characters` })
        else if (value.length > max)
            this.setState({ [`${valueDisplay.toLowerCase()}Helper`]: `${valueDisplay} has to be shorter or equal to ${max} characters` })
        else if (!(regexp.test(value)) && valueDisplay === "Email")
            this.setState({ [`${valueDisplay.toLowerCase()}Helper`]: `${valueDisplay} has to be a valid email address` })
        else if (!(regexp.test(value)) && valueDisplay === "Password")
            this.setState({ [`${valueDisplay.toLowerCase()}Helper`]: `${valueDisplay} has to include one lower one upper letter and a digit` })
        else if (!(regexp.test(value)))
            this.setState({ [`${valueDisplay.toLowerCase()}Helper`]: `${valueDisplay} can not contain numbers` })
        else {
            this.setState({ [`${valueDisplay.toLowerCase()}Helper`]: false });
            return true;
        }
        return false;
    }

    comparePasswords = (passwordRepeat = this.state.passwordRepeat) => {
        if (this.state.password === passwordRepeat) {
            this.setState({ compareHelper: false })
            return true;
        }
        this.setState({ compareHelper: "Passwords have to be the same" });
        return false;
    }

    prompt = (helper) => {
        if (helper === null)
            return;
        else if (helper)
            return <span><i className="icon-cancel text-danger" /></span>;
        else
            return <span><i className="icon-check text-success" /></span>
    }

    checkGender = () => {
        if (this.state.gender === "") {
            this.setState({ genderHelper: "You have to choose a gender" });
            return false;
        }
        else
            return true;
    }

    render() {
        if (this.state.redirect)
            return <Redirect to="/registered" />
        else if (this.state.loader)
            return <Loader />
        return (
            <>
                <h1>Register</h1>
                <form onSubmit={this.onRegisterSubmit} autoComplete="false" className="col-12 col-md-7 offset-lg-1 col-lg-6">
                    {this.state.error ? <span className="alert-danger m-2">{this.state.error}</span> : null}
                    <div className="form-group text-nowrap">
                        <label htmlFor="name" className="d-block">Name </label>
                        <div className="text-danger text-wrap m-1">{this.state.nameHelper}</div>
                        <input type="text" className="form-control d-inline-block text-capitalize" id="name" placeholder="name"
                            value={this.state.name}
                            onChange={this.onNameChange}
                        />
                        {this.prompt(this.state.nameHelper)}
                    </div>
                    <div className="form-group text-nowrap">
                        <label htmlFor="surname" className="d-block">Surname </label>
                        <div className="text-danger text-wrap m-1">{this.state.surnameHelper}</div>
                        <input type="text" className="form-control d-inline-block text-capitalize" id="surname" placeholder="surname"
                            value={this.state.surname}
                            onChange={this.onSurnameChange}
                        />
                        {this.prompt(this.state.surnameHelper)}
                    </div>
                    <div className="form-group text-nowrap">
                        <label htmlFor="email" className="d-block">Email address</label>
                        <div className="text-danger text-wrap m-1">{this.state.emailHelper}</div>
                        <input type="text" className="form-control d-inline-block" id="email" placeholder="email@example.com" aria-describedby="emailHelp"
                            value={this.state.email}
                            onChange={this.onEmailChange}
                        />
                        {this.prompt(this.state.emailHelper)}
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group text-nowrap">
                        <label htmlFor="password" className="d-block">Password </label>
                        <div className="text-danger text-wrap m-1">{this.state.passwordHelper}</div>
                        <input type="password" autoComplete="new-password" className="form-control d-inline-block" id="password" placeholder="********"
                            value={this.state.password}
                            onChange={this.onPasswordChange}
                        />
                        {this.prompt(this.state.passwordHelper)}
                    </div>
                    <div className="form-group text-nowrap">
                        <label htmlFor="password-repeat" className="d-block">Repeat password </label>
                        <div className="text-danger text-wrap m-1">{this.state.compareHelper}</div>
                        <input type="password" className="form-control d-inline-block" id="password-repeat" placeholder="********"
                            value={this.state.passwordRepeat}
                            onChange={this.onPasswordRepeatChange}
                        />
                        {this.prompt(this.state.compareHelper)}
                    </div>
                    <div className="form-group">
                        <div className="text-danger text-wrap m-1">{this.state.genderHelper}</div>
                        <p className="mb-1">Gender: </p>
                        <div className="form-check">
                            <label>
                                <input
                                    type="radio" name="gender" value="Male"
                                    checked={this.state.gender === "Male"}
                                    onChange={this.onGenderChange}
                                    className="form-check-input"
                                />
                                Male
                                </label>
                        </div>
                        <div className="form-check">
                            <label>
                                <input
                                    type="radio" name="gender" value="Female"
                                    checked={this.state.gender === "Female"}
                                    onChange={this.onGenderChange}
                                    className="form-check-input"
                                />
                                Female
                                </label>
                        </div>
                        <div className="form-check">
                            <label>
                                <input
                                    type="radio" name="gender" value="Other"
                                    checked={this.state.gender === "Other"}
                                    onChange={this.onGenderChange}
                                    className="form-check-input"
                                />
                                Other
                                </label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-danger">Sign up</button>
                </form>
                <div className="col-12 col-md-3 mt-4 mt-md-3">
                    <Link to="/login">
                        <div className="btn btn-block btn-dark text-center text-white">Not a new member?<br /> Log in!</div>
                    </Link>
                </div>
            </>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        getInfo: store.info
    };
}

export default connect(mapStoreToProps, { info })(Register);