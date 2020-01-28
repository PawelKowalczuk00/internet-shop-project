// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Redirect  } from 'react-router-dom';
import { connect } from 'react-redux';

const UserComponent = (props) => {
    return <Redirect to={props.info.route}/>
}

const mapStoreToProps = (store) => {
    return {
        info: store.info
    };
}

export default connect(mapStoreToProps)(UserComponent);
