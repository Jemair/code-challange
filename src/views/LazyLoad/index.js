import React, { PureComponent } from 'react'
import { List } from 'immutable'
import { ListView } from 'antd-mobile'
import ReactDOM from 'react-dom'
import { fetchDoubanList } from '../../api'
import s from './index.styl'

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  )
}

export default class LazyLoad extends PureComponent {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

    this.state = {
      ds,
      height: document.documentElement.clientHeight * 3 / 4,
      list: List(),
    }
  }

  componentDidMount() {
    this.setHeight()
    this.generateData()
  }

  /**
   * 刷新数据并存入state
   */
  async generateData() {
    let imList
    const lsList = window.list
    if (!lsList || lsList.length < 10) {
      const list = await fetchDoubanList()
      imList = list.subjects
      window.list = imList
    } else {
      imList = lsList
    }

    console.log(typeof imList)

    const { list: stList, ds } = this.state
    const newList = stList.concat(imList)
    this.setState({
      list: newList,
      ds: ds.cloneWithRows(newList.toArray()),
    })
  }

  /**
   * ListView在不以body为父元素时需要手动设置高度
   */
  setHeight = () => {
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop
    this.setState({
      height: hei,
    })
  }

  renderRow = (rowData, _, rowID) => {
    console.log(rowID)
    return (
      <div key={rowID}>
        <p className={s.title}>{rowData.title}</p>
      </div>
    )
  }

  render() {
    const { ds, height } = this.state
    console.log(ds)

    return (
      <ListView
        ref={el => { this.lv = el }}
        dataSource={ds}
        renderHeader={() => <span>header</span>}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
          {this.state.isLoading ? 'Loading...' : 'Loaded'}
        </div>)}
        renderRow={this.renderRow}
        renderBodyComponent={() => <MyBody />}
        style={{ height }}
        pageSize={4}
        onScroll={() => {
          console.log('scroll')
        }}
        scrollRenderAheadDistance={500}
      />
    )
  }
}
