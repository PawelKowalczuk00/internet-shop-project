import React from 'react';
import { Link } from 'react-router-dom';

import '../css/List.css';

const List = (props) => {
    if (props.count === 0)
        return (
            <div className="m-2">
                <h3 className="alert-warning text-wrap">Sorry, we could not find specified product</h3>
            </div>
        );
    return (
        <div className="d-flex flex-wrap justify-content-center">
            {props.list.map(prod => {
                return (
                    <div className="product m-md-1">
                        <Link to={{
                            pathname: `/product`,
                            search: `?id=${prod._id}`
                        }}>
                            <ul className="list-group list-unstyled flex-grow-1 flex-shrink-1">
                                <li className="list-group-item prod picture"><img src={`https://internet-shop-project-pk2020.herokuapp.com/prodImg/${prod.imgUrl}`} alt="Product"/></li>
                                <li className="list-group-item"><span className="text-dark font-weight-bolder">Name: </span><span className="text-capitalize text-left">{prod.name.join(" ")}</span></li>
                                <li className="list-group-item"><span className="text-dark font-weight-bolder">Price: </span><span className="font-weight-bolder text-left">{prod.price}zł</span></li>
                                <li className="list-group-item"><p className="text-capitalize descr">{prod.description.join(" ")}</p></li>
                            </ul>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}

export default List;
