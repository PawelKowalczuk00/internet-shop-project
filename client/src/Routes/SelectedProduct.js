import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';

import Loader from '../Components/LoaderComponent';
import { selectProduct, addToBasket } from '../Redux/actionCreators';

import '../css/SelectedProduct.css';

class SelectedProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false, loader: false, error: null,
        };
    }

    componentDidMount() {
        this.mounted = true;
        if (this.props.location.state?.existingProduct)
            return;
        this.setState({ loader: true });
        const { id } = queryString.parse(this.props.location.search);
        this.props.selectProduct(id)
            .then(() => this.forceUpdate())
            .catch(er => {
                console.log('er :', er);
                if (er.response)
                    this.setState({ error: er.response.data });
                else
                    this.setState({ error: er.messsage });
            })
            .finally(() => this.mounted ? this.setState({ loader: false }) : null);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    addToBasket = () => {
        this.props.addToBasket(this.props.product);
        this.setState({redirect: true});
    }

    renderDetails() {
        const { product } = this.props;
        return (
            <>
                <div className="col-12 col-md-10 offset-lg-1 col-lg-9">
                    <img src={product.imgUrl} alt="Product photo" className="img-thumbnail" />
                </div>
                <div className="col-12 col-md-10 offset-lg-1 col-lg-9">
                    {this.props.product.finalized ?
                        <h2 className="text-danger text-muted">This product has been sold</h2>
                        :
                        <button className="btn btn-success m1" onClick={this.addToBasket}>Add to basket</button>
                    }
                </div>
                <div className="col-12 col-md-10 offset-lg-1 col-lg-9">
                    <table class="table table-bordered table-striped table-danger">
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
            return <Redirect to="/basket" />
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
    };
}

export default connect(mapStoreToProps, {
    selectProduct, addToBasket
})(SelectedProduct);