import React from 'react'
import { hot } from 'react-hot-loader'
import { renderRoutes } from 'react-router-config'
import { BrowserRouter as Router } from 'react-router-dom'
import routes from 'routes'
import './App.styl'

// 初始化rem
;((docs, win) => {
  const docEls = docs.documentElement
  const resizeEvts = 'orientationchange' in window ? 'orientationchange' : 'resize'
  const recalcs = function() {
    window.rem = docEls.getBoundingClientRect().width / 37.5
    docEls.style.fontSize = window.rem + 'px'
  }
  recalcs()
  if (!docs.addEventListener) {
    return
  }
  win.addEventListener(resizeEvts, recalcs, false)
})(document, window)

const App = () => (
  <div className="App">
    <Router>
      {renderRoutes(routes)}
    </Router>
  </div>
)

export default hot(module)(App)
