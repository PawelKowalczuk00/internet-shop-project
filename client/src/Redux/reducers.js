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
    else if (action.type === "REMOVE_FROM_BASKET")
        return basket.filter(prod => prod._id !== action.payload)
    return basket;
}

const info = (info = { route: "/register" }, action) => {
    if (action.type === "INFO")
        return action.payload;
    return info;
}

const urlQueue = (urlQueue = false, action) => {
    if (action.type === "PUSH_URL")
        return action.payload;
    else if (action.type === "POP_URL")
        return false;
    return urlQueue;
}

export default combineReducers({ selectOne, compare, list, basket, info, urlQueue })