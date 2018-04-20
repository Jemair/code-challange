import React, { PureComponent } from 'react'
import { NavLink as Link } from 'react-router-dom'

export default class App extends PureComponent {
  render() {
    return (
      <div>
        <Link style={{ color: '#00f', fontSize: '2rem' }} to="/firstAttempt">Tab demo.</Link>
        <br />
        <br />
        <br />
        <Link style={{ color: '#00f', fontSize: '2rem' }} to="/virtualized">Infinite list. Route change with animation.</Link>
      </div>
    )
  }
}
