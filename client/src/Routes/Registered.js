/* eslint-disable no-control-regex */
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
            return <Redirect to="/login" />
        return (
            <div className="text-center">
                <h2 className="text-success">You have been succesfully registered</h2>
                <p>Confirmation Email has been sent</p>
                <p>Now log in</p>
            </div>
        );
    }
}

export default Registered;