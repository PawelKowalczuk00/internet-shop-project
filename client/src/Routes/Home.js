import React from 'react';

import '../css/Home.css';
import nodeLogo from '../images/node_logo.png';
import reactLogo from '../images/react_logo.png';
import herokuLogo from '../images/heroku_logo.jpg';
import gitLogo from '../images/github_logo.jpg';

class Home extends React.Component {

    render() {
        return (
            <div className="row">
                <header className="col-12 offset-md-2 col-md-8">
                    <h1 className="text-center">Welcome to my demo page!</h1>
                    <h3 className="mt-4 mb-2 m-0 ml-sm-5 ml-md-0">This webpage uses this technological solutions and tools:</h3>
                </header>
                <div className="col-12 offset-md-2 col-md-10 col-lg-4 bracket node">
                    <div className="text-center mb-2">
                        <a target="_blank" href="https://nodejs.org/en/"><img className="m-1 ml-2 d-inline-block" src={nodeLogo} alt="Node Js" /></a>
                    </div>
                    <h5>Server:</h5>
                    <ul className="ml-3">
                        <li>Routing using <a target="_blank" href="https://www.npmjs.com/package/express">Express</a></li>
                        <li>Futuristic node version 13.6 with ES6 import/export syntax</li>
                        <li>CORS allowing requests only from app client</li>
                        <li>Error routing and logging into file</li>
                        <li><a target="_blank" href="https://jwt.io/">JSON web token</a> authentication and authorisation</li>
                        <li>CRUD for products <b>including pictures</b></li>
                        <li><a target="_blank" href="https://www.mailjet.com/">Email</a> verification</li>
                    </ul>
                    <h5>Data base:</h5>
                    <ul className="ml-3">
                        <li>Using <a target="_blank" href="https://www.mongodb.com/">MongoDB</a> with both approaches: update and query first</li>
                        <li>Save connection using environment variables</li>
                    </ul>
                </div>
                <div className="col-12 offset-md-2 col-md-10 offset-lg-0 col-lg-4 bracket react">
                    <div className="text-center mb-2">
                        <a target="_blank" href="https://reactjs.org/"><img className="m-1 ml-2 d-inline-block" src={reactLogo} alt="React Js" /></a>
                    </div>
                    <h5>Frontend:</h5>
                    <ul className="ml-3">
                        <li>Using <b>Redux</b> for one directional flow of global state</li>
                        <li>Logical routing that creates a <b>Single Page Application</b></li>
                        <li><a target="_blank" href="https://getbootstrap.com/">Bootstrap</a> for <b>responsivness</b></li>
                        <li>Modern React solutions including static images in source folder and bootstrap as a node module</li>
                        <li>Google fonts and fontello</li>
                    </ul>
                </div>
                <div className="col-12 offset-md-2 col-md-10 offset-lg-0 col-lg-4 bracket heroku">
                    <div className="text-center mb-2">
                        <a target="_blank" target="_blank" href="https://dashboard.heroku.com"><img className="m-1 ml-2 d-inline-block" src={herokuLogo} alt="Heroku" /></a>
                    </div>
                    <h5>Hosting:</h5>
                    <ul className="ml-3">
                        <li><a href="https://devcenter.heroku.com/articles/heroku-cli">Heroku CLI</a> utilities</li>
                    </ul>
                </div>
                <div className="col-12 offset-md-2 col-md-10 offset-lg-0 col-lg-4 bracket git">
                    <div className="text-center mb-2">
                        <a target="_blank" href="https://github.com/"><img className="m-1 ml-2 d-inline-block" src={gitLogo} alt="GitHub" /></a>
                    </div>
                    <h5>View the source code in GitHub:</h5>
                    <h6><a target="_blank" href="https://github.com/">sdvsfvdfv</a></h6>
                    <p className="mt-4 mb-0">Also check out my other project:</p>
                    <p><a target="_blank" href="https://github.com/">sdvsfvdfv</a></p>
                </div>
            </div>
        );
    }
}

export default Home
