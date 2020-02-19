import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import '../css/Navbar.css';
import "../fontello/css/fontello.css";

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { keywords: "" }
        this.navBuy = React.createRef();
        this.navSell = React.createRef();
    }

    onNavOtherClick = (e) => {
        this.navBuy.current.classList.remove("active");
        this.navSell.current.classList.remove("active");
    }
    onNavSearchClick = (e) => {
        this.navBuy.current.classList.add("active");
        this.navSell.current.classList.remove("active");
    }
    onNavSellClick = (e) => {
        this.navBuy.current.classList.remove("active");
        this.navSell.current.classList.add("active");
    }

    renderSearchBar = () => {
        if (!this.props.hide)
            return (
                <form className="d-none d-md-block mb-3 mb-md-1">
                    <input type="text" placeholder="Search for product" value={this.state.keywords}
                        onChange={(e) => this.setState({ keywords: e.target.value })} />
                    <Link to={{
                        pathname: "/products",
                        //sendings to /products will be avaiable at props.location.state.keywords
                        state: { keywords: this.state.keywords.trim().split(" ") }
                    }}>
                        <button onClick={this.onNavSearchClick}><i className="icon-search" /></button>
                    </Link>
                </form>
            );
    }

    render() {
        return (
            <nav className="navbar navbar-dark bg-danger navbar-expand-md mb-1 mb-md-3">
                <div className="">
                    <Link to="/" onClick={this.onNavOtherClick} id="brand">
                        <span className="navbar-brand">Internet Shop</span>
                    </Link>
                </div>
                <button className="navbar-toggler mr-auto" type="button" data-toggle="collapse" data-target="#menu">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="menu">
                    <ul className="navbar-nav mr-auto text-center">
                        <li className="nav-item" onClick={this.onNavSearchClick}>
                            <Link to="/products">
                                <span className="nav-link" ref={this.navBuy}> Search/Buy </span>
                            </Link>
                        </li>
                        <li className="nav-item" onClick={this.onNavSellClick}>
                            <Link to="/sell">
                                <span className="nav-link" ref={this.navSell}> Sell </span>
                            </Link>
                        </li>
                    </ul>
                    {this.renderSearchBar()}
                </div>
                <div className="mx-2 ml-md-3 mr-lg-5 text-center" onClick={this.onNavOtherClick}>
                    <div className="d-inline-block mx-1 mx-lg-3 thumbnails">
                        <Link to="/user">
                            Account 
                            <i className="icon-adult text-white" />
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        hide: store.hideSearchBar
    };
}

export default connect(mapStoreToProps)(Navbar);