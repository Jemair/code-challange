import React from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import MainView from './views/MainView'
import './App.styl'
import Virtualized from './views/Virtualized'
import FirstAttempt from './views/FirstAttempt'
import './utils/rem'

const App = () => (
  <div className="App">
    <Router>
      <div>
        <Route exact path="/" component={MainView} />
        <Switch>
          <Route path="/firstAttempt" component={FirstAttempt} />
          <Route path="/virtualized" component={Virtualized} />
        </Switch>
      </div>
    </Router>
  </div>
)

export default hot(module)(App)
