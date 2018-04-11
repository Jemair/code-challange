import React, { PureComponent } from 'react'
import { Tabs } from 'antd-mobile'
import LongList from './LongList'
import LazyLoad from './LazyLoad'

const tabs = [
  { title: 'The first tab' },
  { title: 'The second tab' },
  { title: 'The third tab' },
]

export default class App extends PureComponent {
  render() {
    return (
      <Tabs
        tabs={tabs}
      >
        <LongList />
        <LazyLoad />
        <div>3</div>
      </Tabs>
    )
  }
}
