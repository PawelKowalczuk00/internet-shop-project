import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Select from 'react-select';

import Loader from '../Components/LoaderComponent';
import { generateProductsList, hideSearchBar } from '../Redux/actionCreators';
import List from '../Components/List';

import '../css/Products.css';

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false, loader: true, error: null,
            filters: { minPrice: 0, maxPrice: 99999, keywords: undefined },
            display: { page: 0, range: 9, sort: "name", order: "" }
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.props.hideSearchBar(true);
        this.searchProducts();
    }

    componentWillUnmount() {
        this.props.hideSearchBar(false);
        this.mounted = false;
    }

    searchProducts = () => {
        this.setState({ loader: true });
        this.props.generateProductsList(this.state.filters, this.state.display)
            .catch(er => {
                console.log('er :', er);
                setTimeout(() => this.searchProducts(), 5000);
                if (er.response)
                    this.setState({ error: er.response.data });
                else
                    this.setState({ error: er.messsage });
            })
            .finally(() => this.mounted ? this.setState({ loader: false }) : null);
    }

    validateNumber = (number, field, oppositeField, min, max) => {
        if (/^[0-9]*$/.test(number))
            if (Number(number) >= min && Number(number) <= max) {
                this.setState({
                    filters:
                    {
                        [field]: number,
                        [oppositeField]: this.state.filters[oppositeField],
                        keywords: this.state.filters.keywords
                    }
                })
                setTimeout(() => this.searchProducts(), 500);
            }
    }

    onSearchChange = text => {
        this.setState({
            filters: {
                keywords: text.trim().split(" "),
                maxPrice: this.state.filters.maxPrice,
                minPrice: this.state.filters.minPrice
            }
        });
    }

    onOrderChange = selectedOption => {
        this.setState({
            display: {
                page: this.state.display.page,
                range: this.state.display.range,
                sort: this.state.display.sort,
                order: selectedOption.value,
            }
        })
        setTimeout(() => this.searchProducts(), 500);
    }

    onSortChange = e => {
        this.setState({
            display: {
                page: this.state.display.page,
                range: this.state.display.range,
                sort: e.target.value,
                order: this.state.display.order
            }
        })
        setTimeout(() => this.searchProducts(), 500);
    }

    onRangeChange = e => {
        const range = e.target.value;
        if (range > 0) {
            this.setState({
                display: {
                    page: this.state.display.page,
                    range: range,
                    sort: this.state.display.sort,
                    order: this.state.display.order
                }
            })
            setTimeout(() => this.searchProducts(), 500);
        }
    }

    onPrevClick = e => {
        if (this.state.display.page > 0) {
            this.setState({
                display: {
                    page: this.state.display.page - 1,
                    range: this.state.display.range,
                    sort: this.state.display.sort,
                    order: this.state.display.order
                }
            })
            setTimeout(() => this.searchProducts(), 500);
        }
    }

    onNextClick = e => {
        if (this.state.display.page * this.state.display.range < this.props.productsCount) {
            this.setState({
                display: {
                    page: this.state.display.page + 1,
                    range: this.state.display.range,
                    sort: this.state.display.sort,
                    order: this.state.display.order
                }
            })
            setTimeout(() => this.searchProducts(), 500);
        }
    }

    onSearchSubmit = e => {
        e.preventDefault();
        this.searchProducts();
    }

    render() {
        if (this.state.redirect)
            return <Redirect to={this.state.redirect} />
        return (
            <>
                <div className="d-none d-sm-block col-sm-3 col-md-2 text-wrap filters">
                    <h3>Filters:</h3>
                    <h4>Price: </h4>
                    <div className="form-group">
                        <input type="number" className="form-control d-inline-block" placeholder="min price"
                            value={this.state.filters.minPrice}
                            onChange={e => this.validateNumber(e.target.value, "minPrice", "maxPrice", 0, 99999)}
                        />
                        <input type="number" className="form-control d-inline-block" placeholder="max price"
                            value={this.state.filters.maxPrice}
                            onChange={e => this.validateNumber(e.target.value, "maxPrice", "minPrice", 0, 99999)}
                        />
                    </div>
                    <h4 className="mt-3">Sort by: </h4>
                    <div className="form-group">
                        <div className="form-check">
                            <label>
                                <input
                                    type="radio" name="sort" value="name"
                                    checked={this.state.display.sort === "name"}
                                    onChange={this.onSortChange}
                                    className="form-check-input"
                                />
                                Name
                                </label>
                        </div>
                        <div className="form-check">
                            <label>
                                <input
                                    type="radio" name="sort" value="price"
                                    checked={this.state.display.sort === "price"}
                                    onChange={this.onSortChange}
                                    className="form-check-input"
                                />
                                Price
                                </label>
                        </div> <br />
                        <h3 className="d-inline-block">Order: </h3>
                        <Select options={[
                            { value: '', label: 'Ascending' },
                            { value: '-', label: 'Descending' }
                        ]}
                            onChange={this.onOrderChange} />
                    </div>
                </div>
                <div className="col-12 col-sm-9 col-md-8">
                    <form className="searchbar" onSubmit={this.onSearchSubmit}>
                        <input type="text" placeholder="Search for product" value={this.state.filters?.keywords?.join(" ")}
                            onChange={e => this.onSearchChange(e.target.value)} />
                        <button type="submit" className="btn-danger ml-2"><i className="icon-search" /></button>
                    </form>
                    <div className="range my-2">
                        <span className="small font-smaller">Displaying </span>
                        <input type="number" className="form-control d-inline-block" placeholder="9"
                            value={this.state.display.range}
                            onChange={this.onRangeChange}
                        />
                        <span className="small font-smaller">Out of </span>
                        <input type="number" className="form-control d-inline-block disabled" disabled
                            value={this.props.productsCount}
                        />
                        <span className="small font-smaller"> products</span>
                    </div>
                    {this.state.loader ? <Loader /> : <List list={this.props.productsList} count={this.props.productsCount} />}
                    <nav className="mt-4" aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                            <li className="page-item">
                                <button className="btn btn-danger" onClick={this.onPrevClick}>Previous</button>
                            </li>
                            <li className="page-item mx-2"><span className="page px-3">{this.state.display.page + 1}</span></li>
                            <li className="page-item">
                                <button className="btn btn-danger" onClick={this.onNextClick}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        productsList: store.list.list,
        productsCount: store.list.count,
        info: store.info
    };
}

export default connect(mapStoreToProps, {
    generateProductsList, hideSearchBar
})(Products);