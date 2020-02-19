import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Loader from '../Components/LoaderComponent';
import storage from '../Functions/userStorage';
import { info } from '../Redux/actionCreators';
import { account, getSingleProduct, transactions } from '../Functions/axios';

import '../css/Account.css';

export class AccountMain extends React.Component {
    render() {
        const user = this.props.main || {};
        return (
            <>
                <h2>{user.name} {user.surname}</h2>
                <h3 className="text-primary">{user.email}</h3>
                {user.veryfied ?
                    <div className="alert-success">Your account is verified. You can sell and buy.</div>
                    :
                    <div className="alert-danger">Your account isn't verified. You can't sell neither buy.</div>
                }
                <div className="my-2">
                    <span className="text-primary">Wallet: </span>
                    <span className="text-success font-weight-bolder text-right">{user.saldo}zł</span>
                </div>
                <table className="table table-sm table-bordered table-striped table-hover">
                    <tbody>
                        <tr>
                            <th scope="row" className="text-capitalize">Register Date: </th>
                            <td>{(new Date(user.registerDate)).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <th scope="row" colSpan="2">Log history: </th>
                        </tr>
                        {user.logHistory?.map(day => {
                            return (
                                <tr>
                                    <td colSpan="2">{(new Date(day)).toLocaleDateString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </>
        );
    }
}

export class AccountOffers extends React.Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false }
    }

    onRowClick = (e) => {
        this.setState({ redirect: e.currentTarget.dataset.id })
    }

    render() {
        if (this.state.redirect)
            return <Redirect to={{
                pathname: `/product`,
                search: `?id=${this.state.redirect}`,
                state: { existingProduct: false }
            }} />
        return (
            <table className="table table-bordered table-primary table-hover">
                <thead>
                    <tr>
                        <th scope="col">Picture</th>
                        <th scope="col">Name</th>
                        <th scope="col">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.activeProducts.map(offer => {
                        return (
                            <tr data-id={offer._id} onClick={this.onRowClick}>
                                <td className="float-left"><img src={`https://internet-shop-project-pk2020.herokuapp.com/prodImg/${offer.imgUrl}`} alt="Product"/></td>
                                <th scope="row" className="text-capitalize">{offer.name?.join(" ")}</th>
                                <td>{(new Date(offer.exposeDate)).toLocaleDateString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

export class AccountTransactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false }
    }

    onRowClick = (e) => {
        this.setState({ redirect: e.currentTarget.dataset.id })
    }

    render() {
        if (this.state.redirect)
            return <Redirect to={{
                pathname: `/product`,
                search: `?id=${this.state.redirect}`,
                state: { existingProduct: false }
            }} />
        return (
            <table className="table table-bordered table-hover mb-2">
                <thead>
                    <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Seller</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.transactions?.map(tran => {
                        return (
                            <tr data-id={tran.product._id} onClick={this.onRowClick}>
                                <th scope="row" className="text-capitalize">{tran.product.name.join(" ")}</th>
                                <td>{tran.seller.email}</td>
                                <td>{tran.buyer.email}</td>
                                <td>{(new Date(tran.date)).toLocaleDateString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

export class AccountLayout extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            redirect: false, error: null, loader: true,
            subPage: "main",
            main: null, transactions: null, activeOffers: null
        }
    }

    async componentDidMount() {
        this.mounted = true;
        await this.getTransactions();
        await this.getMain();
        await this.getActiveOffers();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getMain = () => {
        this.setState({ loader: true, error: null });
        return account()
            .then(res => this.setState({ main: res.data }))
            .catch(er => {
                console.log(er);
                this.setState({ error: er.response?.data || er.message });
                this.props.info({ route: "/login" });
                setTimeout(() => this.mounted ? this.setState({ redirect: "/user" }) : null, 2000);
            })
            .finally(() => this.mounted ? this.setState({ loader: false }) : null);
    }

    getTransactions = () => {
        this.setState({ loader: true, error: null });
        return transactions()
            .then(res => this.setState({ transactions: res.data }))
            .catch(er => {
                console.log(er);
                this.setState({ error: er.response?.data || er.message });
                this.props.info({ route: "/login" });
                setTimeout(() => this.mounted ? this.setState({ redirect: "/user" }) : null, 2000);
            })
            .finally(() => this.mounted ? this.setState({ loader: false }) : null);
    }

    getActiveOffers = async () => {
        this.setState({ loader: true, error: null });
        try {
            this.state.main.activeProducts.sort();
            let activeOffers = [];
            for (let id of this.state.main.activeProducts) {
                activeOffers.unshift((await getSingleProduct(id)).data);
            }
            this.setState({ activeOffers });
        }
        catch (er) {
            console.log(er);
            this.setState({ error: er.response?.data || er.message });
            this.props.info({ route: "/login" });
            setTimeout(() => this.mounted ? this.setState({ redirect: "/user" }) : null, 2000);
        }
        finally {
            if (this.mounted)
                this.setState({ loader: false });
        }
    }

    renderView = (page) => {
        if (page === "offers")
            return <AccountOffers activeProducts={this.state.activeOffers} />
        else if (page === "transactions")
            return <AccountTransactions transactions={this.state.transactions} />
        else
            return <AccountMain main={this.state.main} />
    }

    logOut = () => {
        storage().setItem('x-auth-token', "");
        storage().setItem('id', "");
        storage().setItem('email', "");
        sessionStorage.clear();
        this.props.info({ route: "/login" });
        this.setState({redirect: "/user"});
    }

    render() {
        if (this.state.redirect)
            return <Redirect to={this.state.redirect} />
        return (
            <div className="col-12 offset-md-1 col-md-9 mb-2">
                <div className="btn-group mb-2" role="group">
                    <button onClick={() => this.setState({ subPage: "main" })} className="btn btn-primary text-wrap">My account</button>
                    <button onClick={() => this.setState({ subPage: "offers" })} className="btn btn-primary text-wrap">My offers</button>
                    <button onClick={() => this.setState({ subPage: "transactions" })} className="btn btn-primary text-wrap">Transaction history</button>
                    <button className="btn btn-danger text-wrap ml-1" onClick={this.logOut}>Log out</button>
                </div>
                {this.state.error ? <h6 className="text-danger m-2">{this.state.error}</h6> : null}
                {this.state.loader ? <Loader /> : this.renderView(this.state.subPage)}
            </div>
        );
    }
}

export default connect(null, { info })(AccountLayout);