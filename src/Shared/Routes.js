import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FindGame from '../Features/Game/FindGame';
import Entry from '../Features/Authentication/Entry';
import Pitch from '../Pitch';
import Profile from '../Features/Player/Profile';
import NotFound from './Presentational/NotFound';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Entry} />
    <Route exact path="/game/search" component={FindGame} />
    <Route exact path="/game/:gameName" component={Pitch} />
    <Route exact path="/player/:playerName/profile" component={Profile} />
    <Route path="*" component={NotFound} />
  </Switch>
);

export default Routes;