import React from 'react';
import { Redirect } from 'react-router-dom';

class Registered extends React.Component {
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
            return <Redirect to="/products" />
        return (
            <div className="text-center col-12 offset-md-2 col-md-8 offset-lg-3 col-lg-7">
                <h2 className="text-success">You have succesfully bought a product</h2>
            </div>
        );
    }
}

export default Registered;