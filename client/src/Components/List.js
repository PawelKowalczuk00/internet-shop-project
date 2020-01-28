import React from 'react';

import '../css/List.css';

const List = (props) => {
    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between flex-wrap">
                {props.list.map(prod => {
                    return (
                        <div className="product">
                            <ul className="list-group list-unstyled">
                                <li className="list-group-item"><h4>Name: </h4><span className="text-capitalize">{prod.name.join(" ")}</span></li>
                                <li className="list-group-item"><h4>Price: </h4><span className="font-weight-bolder">{prod.price}</span></li>
                                <li className="list-group-item"><h4>Description: </h4><span className="text-capitalize descr">{prod.description.join(" ")}</span></li>
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default List;
