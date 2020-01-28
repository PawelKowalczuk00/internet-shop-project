import { combineReducers } from 'redux';

const selectOne = (selectedProduct = {}, action) => {
    if (action.type === "SELECT")
        return action.payload;
    return selectedProduct;
}

const compare = (productsToCompare = [], action) => {
    if (action.type === "COMPARE")
        return action.payload;
    return productsToCompare;
}

const list = (productsList =
    {
        list: [],
        count: 0
    }, action) => {
    if (action.type === "LIST")
        return action.payload;
    return productsList;
}

const basket = (basket = [], action) => {
    if (action.type === "ADD_TO_BASKET")
        return [...basket, action.payload];
    return basket;
}

const info = (info = { route: "/register" }, action) => {
    if (action.type === "INFO")
        return action.payload;
    return info;
}

export default combineReducers({ selectOne, compare, list, basket, info })