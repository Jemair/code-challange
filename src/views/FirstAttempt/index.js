import React, { PureComponent } from 'react'
import { Tabs } from 'antd-mobile'
import LongList from '../LongList'
import LazyLoad from '../LazyLoad'

const tabs = [
  { title: 'A Long Long List' },
  { title: 'Lazy Load' },
]

export default class FirstAttempt extends PureComponent {
  render() {
    return (
      <Tabs
        tabs={tabs}
        initialPage={0}
        distanceToChangeTab={0.05}
        destroyInactiveTab
      >
        <LongList />
        <LazyLoad />
      </Tabs>
    )
  }
}
