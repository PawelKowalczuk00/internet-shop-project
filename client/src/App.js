import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter, Route } from 'react-router-dom';

import reducers from './Redux/reducers';

import Navbar from './Components/Navbar';
import Home from './Routes/Home';
import Products from './Routes/Products';
import SelectedProduct from './Routes/SelectedProduct';
import UserComponent from './Components/UserComponent';
import Login from './Routes/Login';
import Register from './Routes/Register';
import Registered from './Routes/Registered';
import Verified from './Routes/Verified';
import AccountLayout from './Routes/Account';
import Comparision from './Routes/Comparision';
import Sell from './Routes/Sell';
import Selled from './Routes/Selled';
import Bought from './Routes/Bought';


import './css/App.css';

const store = createStore(reducers, applyMiddleware(thunk));

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <div className="container mx-1 mx-md-2 mx-lg-5 mb-3">
          <div className="row">
              <Route path="/" exact component={Home} />
              <Route path="/products" exact component={Products} />
              <Route path="/product" component={SelectedProduct} />
              <Route path="/user" exact component={UserComponent} />
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Register} />
              <Route path="/registered" exact component={Registered} />
              <Route path="/verified" exact component={Verified} />
              <Route path="/account" exact component={AccountLayout} />
              <Route path="/comparision" exact component={Comparision} />
              <Route path="/sell" exact component={Sell} />
              <Route path="/selled" component={Selled} />
              <Route path="/bought" exact component={Bought} />
            <aside className="d-none d-md-block col-md-2 text-right">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mi lectus, hendrerit id nunc sit amet, malesuada suscipit sapien. Sed enim sapien, commodo vitae dignissim sit amet, iaculis ut justo. Aliquam scelerisque leo semper, commodo enim sit amet, cursus massa. Mauris vitae mollis nunc, sit amet interdum odio. Mauris finibus.
              Reklama
            </aside>
          </div>
        </div>
      </BrowserRouter>
      <footer>
        Paweł Kowalczuk - Internet Shop
      </footer>
    </Provider>
  );
}

export default App;
