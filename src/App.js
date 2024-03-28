import './App.css';
import GameOver from './pages/game_over';
import LoginPage from './pages/login';
import TeamPage from './pages/team';
import Scoreboard from './pages/scoreboard';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage } />
        <Route path="/game_team" component={TeamPage} />
        <Route path="/game_over" component={GameOver} />
      </Switch>
    </Router>
  );
};

export default App;