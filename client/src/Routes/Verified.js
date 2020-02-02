import React from 'react';
import { Link } from 'react-router-dom';

const Verified = () => {
        return (
            <div className="text-center col-12 offset-md-2 col-md-8 offset-lg-3 col-lg-7">
                <h2 className="text-success">You have succesfully verified your account!</h2>
                <Link to="/account" className="btn btn-succes btn-block">Visit yor account</Link>
            </div>
        );
}

export default Verified;