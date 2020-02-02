import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class Selled extends React.Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({redirect: true});
        }, 1500)
    }

    render() {
        if (this.state.redirect)
            return <Redirect to={{
                pathname: `/product`,
                search: `?id=${this.props.product._id}`,
                state: {existingProduct: true}
            }}/>
        return (
            <div className="text-center">
                <h2 className="text-success">You have succesfully created an offer!</h2>
                <p>Confirmation Email has been sent</p>
            </div>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        product: store.selectOne,
    };
}

export default connect(mapStoreToProps)(Selled);