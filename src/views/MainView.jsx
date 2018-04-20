import React, { PureComponent } from 'react'
import { NavLink as Link } from 'react-router-dom'

export default class App extends PureComponent {
  render() {
    const { match } = this.props
    return (
      <div>
        <Link to={`${match.url}firstAttempt`}>First Attempt</Link>
        <br />
        <Link to="/virtualized">Virtualized</Link>
      </div>
    )
  }
}
