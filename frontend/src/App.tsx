import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import HomeView from './components/HomeView';
import LoginView from './components/LoginView';
import MediaListView from './components/MediaListView';
import MediaView from './components/MediaView';
import ProfileView from './components/ProfileView';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route exact path="/login" component={LoginView} />
            <Route exact path="/media/" component={MediaListView} />
            <Route exact path="/media/:media_id" component={MediaView} />
            <Route exact path="/profile/:user_name" component={ProfileView} />
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}