import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import HomeView from './components/HomeView';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={HomeView} />
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}