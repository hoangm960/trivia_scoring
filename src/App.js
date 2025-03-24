import "./App.css";
import LoginPage from "./pages/login";
import GameOver from "./pages/game_over";
import Game from "./pages/game.jsx";
import Scoreboard from "./pages/scoreboard";
import Betting from "./pages/betting";
import Question from "./pages/question";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={LoginPage} />
				<Route path="/game" component={Game} />
				<Route path="/game/betting" component={Betting} />
				<Route path="/game/question" component={Question} />
				<Route path="/game_over" component={GameOver} />
				<Route path="/scoreboard" component={Scoreboard} />
			</Switch>
		</Router>
	);
};

export default App;
