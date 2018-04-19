import React, { PureComponent } from 'react'
import { NavLink as Link, Route, Switch } from 'react-router-dom'
import Virtualized from './Virtualized'
import FirstAttempt from './FirstAttempt'

export default class App extends PureComponent {
  render() {
    const { match } = this.props
    console.log(match.url)
    return (
      <div>
        <Link to={`${match.url}firstAttempt`}>First Attempt</Link>
        <br />
        <Link to="/virtualized">Virtualized</Link>
      </div>
    )
  }
}
