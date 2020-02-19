import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';

import Loader from '../Components/LoaderComponent';
import { selectProduct } from '../Redux/actionCreators';
import { buy, deleteOffer } from '../Functions/axios';
import storage from '../Functions/userStorage';

import '../css/SelectedProduct.css';

class SelectedProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false, loader: true, error: null,
            disabled: true,
        };
    }

    async componentDidMount() {
        this.mounted = true;
        const { id } = queryString.parse(this.props.location.search);
        await this.props.selectProduct(id)
            .then(() => {
                if (!(storage().getItem('saldo')))
                    this.setState({ error: "You have to be logged in and verified to buy products" });
                else if (storage().getItem('saldo') < this.props.product.price)
                    this.setState({ error: "You don't have enough money" })
                else
                    this.setState({ disabled: false });
            })
            .catch(er => {
                console.log('er :', er);
                if (er.response)
                    this.setState({ error: er.response.data });
                else
                    this.setState({ error: er.messsage });
            })
            .finally(() => {
                if (this.mounted) {
                    this.setState({ loader: false });
                }
            });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    buy = () => {
        this.setState({ error: null, loader: true });
        buy(this.props.product._id)
            .then(res => this.setState({ redirect: "/bought" }))
            .catch(er => {
                console.log('er :', er);
                if (er.response)
                    this.setState({ error: er.response.data });
                else
                    this.setState({ error: er.messsage });
                setTimeout(() => {
                    if (er.response?.status === 401) {
                        this.setState({ redirect: "/login" });
                        this.props.pushUrl(this.props.location + this.props.location.search);
                    }
                }, 1500);
            })
            .finally(() => this.mounted ? this.setState({ loader: false }) : null);
    }

    delete = () => {
        this.setState({ error: null, loader: true });
        deleteOffer(this.props.product._id)
            .then(() => this.setState({ redirect: "/deleted" }))
            .catch(er => {
                console.log('er :', er);
                if (er.response)
                    this.setState({ error: er.response.data });
                else
                    this.setState({ error: er.messsage });
            })
            .finally(() => this.mounted ? this.setState({ loader: false }) : null);
    }

    renderButton = () => {
        if (this.props.product.finalized)
            return <h2 className="text-danger text-muted">This product has been sold</h2>
        if (this.props.product.seller?.email === storage().getItem('email'))
            return (
                <>
                    <button className="btn btn-danger m-1 d-inline-block" onClick={this.delete} disabled={this.state.disabled}>Delete offer</button>
                    <button className="btn btn-primary mr-4 d-inline-block" onClick={e => this.setState({ redirect: "/edit/"+this.props.product._id })} disabled={this.state.disabled}>Edit offer</button>
                </>
            );
        return <button className="btn btn-success m-1" onClick={this.buy} disabled={this.state.disabled}>Buy</button>
    }

    renderDetails() {
        const { product } = this.props;
        return (
            <>
                <div className="col-12 col-md-10 offset-lg-1 col-lg-9">
                    <img src={`https://internet-shop-project-pk2020.herokuapp.com/prodImg/${product.imgUrl}`} alt="Product" className="img-full" />
                    <div>{this.state.error ? <span className="text-danger m-2">{this.state.error}</span> : null}</div>
                    <div className="text-right">
                        {this.renderButton()}
                    </div>
                    <table className="table table-bordered table-striped table-danger">
                        <tbody>
                            <tr>
                                <th scope="row">Name: </th>
                                <td className="text-capitalize text-wrap">{product.name?.join(" ")}</td>
                            </tr>
                            <tr className="font-weight-bolder border-danger">
                                <th scope="row">Price: </th>
                                <td>{product.price}zł</td>
                            </tr>
                            <tr>
                                <th scope="row">Seller: </th>
                                <td>{product.seller?.email}</td>
                            </tr>
                            <tr>
                                <th scope="row">Date of creating the offer: </th>
                                <td>{(new Date(product.exposeDate)).toLocaleDateString()}</td>
                            </tr>
                            {product.finalized ?
                                <tr>
                                    <th scope="row">Date of sale: </th>
                                    <td>{(new Date(product.transaction?.date)).toLocaleDateString()}</td>
                                </tr>
                                :
                                null
                            }
                            <tr>
                                <th scope="row">Description</th>
                                <td className="text-capitalize text-wrap">{product.description?.join(" ")}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        );
    }

    render() {
        if (this.state.redirect)
            return <Redirect to={this.state.redirect} />
        return (
            <>
                {this.state.loader ? <Loader /> : this.renderDetails()}
            </>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        product: store.selectOne,
        status: store.info.route
    };
}

export default connect(mapStoreToProps, {
    selectProduct
})(SelectedProduct);