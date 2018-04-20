import React, { PureComponent } from 'react'
import { Tabs } from 'antd-mobile'
import LongList from '../LongList'
import LazyLoad from '../LazyLoad'

const tabs = [
  { title: 'Pannel 1' },
  { title: 'Pannel 2' },
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
