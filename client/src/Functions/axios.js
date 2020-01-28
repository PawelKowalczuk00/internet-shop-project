import axios from 'axios';
import userStorage from "./userStorage";

const base = axios.create({
    //baseURL: "https://coders-camp-2019-team-alpha.herokuapp.com/api",
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": 'application/json'
    }
});

export const getProducts = async (body = {}, filters) => {
    return base.post('/products', JSON.stringify(body), {
        params: {
            "page": filters?.page,
            "range": filters?.range,
            "sort": filters?.sort,
            "order": filters?.order
        }
    });
}

export const getSingleProduct = async (id) => {
    return base.get(`/products/${id}`);
}

export const login = async (body) => {
    return base.post('/login', JSON.stringify(body));
}

export const register = async (body) => {
    return base.post('/register', JSON.stringify(body));
}

export const account = async () => {
    return base.get(`/account/${userStorage().getItem('id')}`, {
        headers: {
            "x-auth-token": userStorage().getItem('x-auth-token')
        }
    });
}

export const createOffer = async (body = {}) => {
    return base.post('/sell', JSON.stringify(body), {
        headers: {
            "x-auth-token": userStorage().getItem('x-auth-token')
        }
    });
}

export const editOffer = async (body = {}, id = 1) => {
    return base.put(`/sell/${id}`, JSON.stringify(body), {
        headers: {
            "x-auth-token": userStorage().getItem('x-auth-token')
        }
    });
}

export const deleteOffer = async (id) => {
    return base.delete(`/sell/${id}`, {
        headers: {
            "x-auth-token": userStorage().getItem('x-auth-token')
        }
    });
}

export const buy = async (id) => {
    return base.get(`/buy/${id}`, {
        headers: {
            "x-auth-token": userStorage().getItem('x-auth-token')
        }
    });
}