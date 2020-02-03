import React from 'react';

export default () => {
    return (
        <div className="col-12 offset-md-2 col-md-8 offset-lg-3 col-lg-7 d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}