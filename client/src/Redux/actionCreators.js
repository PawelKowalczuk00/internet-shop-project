import { getProducts, getSingleProduct } from '../Functions/axios';

export const info = (info) => {
    return {
        type: "INFO",
        payload: info
    }
}

export const pushUrl = (url) => {
    return {
        type: "PUSH_URL",
        payload: url
    }
}

export const popUrl = () => {
    return {
        type: "POP_URL",
    }
}

export const compareProducts = (ids) => {
    let products = [];
    return dispatch => {
            ids.map(async id => products.push(JSON.parse(await getSingleProduct(id))));
            return dispatch({
                type: "COMPARE",
                payload: products
            })
    }
}

export const addToBasket = (prod) => {
    return {
        type: "ADD_TO_BASKET",
        payload: prod
    }
}

export const selectProduct = (id) => {
    return async dispatch => {
        getSingleProduct(id)
            .then(res => {
                dispatch({
                    type: "SELECT",
                    payload: JSON.parse(res)
                })
            })
    }
}

export const generateProductsList = (body, filters) => {
    return async dispatch => {
        getProducts(body, filters)
            .then(res => {
                dispatch({
                    type: "LIST",
                    payload: {
                        list: res.data.productsList,
                        count: res.data.howMany
                    }
                })
            })
    }
}