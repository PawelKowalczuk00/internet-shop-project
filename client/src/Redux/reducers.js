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

const userStatus = () => {
        if (localStorage.getItem('id'))
            return "/account";
        return "/register";
}

const info = (info = { route: userStatus() }, action) => {
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

const hideSearchBar = (hideSearchBar = false, action) => {
    if (action.type === "HIDE")
        return action.payload;
    return hideSearchBar;
}

export default combineReducers({ selectOne, compare, list, info, urlQueue, hideSearchBar })