import MainView from 'views/MainView'
import Virtualized from '../views/Virtualized'
import FirstAttempt from '../views/FirstAttempt'

export default [
  {
    path: '/',
    component: MainView,
    childRoutes: [{
      path: '/virtualized',
      component: Virtualized,
    }, {
      path: '/firstAttempt',
      component: FirstAttempt,
    }],
  }, {
    path: '/detail',
    component: Virtualized,
  },
]
