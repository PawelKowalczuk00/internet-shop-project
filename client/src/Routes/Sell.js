import React from 'react';
import { connect } from 'react-redux';

import { info } from '../Redux/actionCreators';

import { createOffer } from '../Functions/axios';

//import './css/Home.css';

class Sell extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "", description: "", price: 0 }
    }

    onSellSubmit = (e) => {
        e.preventDefault();
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
            this.props.info(er.message);
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSellSubmit}>
                    <span className="text-danger">{this.props.status}</span>
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
                        <input type="text" className="form-control" id="price" placeholder="price"
                            value={this.state.price}
                            onChange={(e) => this.setState({ price: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Create an offer</button>
                </form>
            </div>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        status: store.info
    };
}

export default connect(mapStoreToProps, {
    info
})(Sell);
