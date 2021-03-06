import axios from 'axios';
import userStorage from "./userStorage";

const base = axios.create({
    baseURL: "https://internet-shop-project-pk2020.herokuapp.com/api",
    //baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": 'application/json'
    }
});

export const getProducts = async (filters = {}, display) => {
    return base.post('/products', JSON.stringify(filters), {
        params: {
            "page": display?.page,
            "range": display?.range,
            "sort": display?.sort,
            "order": display?.order
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

export const transactions = async () => {
    return base.get(`/account/${userStorage().getItem('id')}/transactions`, {
        headers: {
            "x-auth-token": userStorage().getItem('x-auth-token')
        }
    });
}

export const createOffer = async (body) => {
    return base.post('/sell', body, {
        headers: {
            "x-auth-token": userStorage().getItem('x-auth-token'),
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const editOffer = async (body, id) => {
    return base.put(`/sell/edit/${id}`, body, {
        headers: {
            "x-auth-token": userStorage().getItem('x-auth-token'),
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const deleteOffer = async (id) => {
    return base.delete(`/sell/delete/${id}`, {
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