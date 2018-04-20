import React, { PureComponent } from 'react'
import { ListView } from 'antd-mobile'
import ReactDOM from 'react-dom'
import { List } from 'immutable'
import s from './index.styl'
import * as data from './data'

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  )
}

export default class LongList extends PureComponent {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

    this.state = {
      ds,
      isLoading: false,
      height: document.documentElement.clientHeight * 3 / 4,
      touchStartEvent: null,
      isSlide: null,
    }
  }

  componentDidMount() {
    this.setHeight()
    this.generateData()
    this.preventUnneededSlide()
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.handleTouchStart)
  }

  /**
   * 刷新数据并存入state
   */
  generateData() {
    let longData = List()
    const { ds } = this.state
    for (let i = 0; i < 2; i++) {
      longData = longData.concat(List(data.subjects))
    }
    this.setState({
      data: longData,
      ds: ds.cloneWithRows(longData.toArray()),
    })
  }

  /**
   * ListView和Tabs组件在上下左右滑动时存在太过灵敏的问题
   * 通过这个方法在纵向滚动大于横向滚动时阻止横向滚动的触发，反之亦然
   */
  preventUnneededSlide = () => {
    const oDiv = ReactDOM.findDOMNode(this.lv)
    oDiv.addEventListener('touchstart', this.handleTouchStart)
  }

  handleTouchStart = ev => {
    this.setState({ touchStartEvent: ev })
    const oDiv = ReactDOM.findDOMNode(this.lv)
    oDiv.addEventListener('touchmove', this.handleTouchmove)
    oDiv.addEventListener('touchend', this.handleTouchEnd)
  }

  /**
   * 判断当次滚动应当触发横向滑动还是纵向滚动
   * @param ev
   */
  handleTouchmove = ev => {
    const { touchStartEvent } = this.state
    const startY = touchStartEvent.touches[0].clientY
    const endY = ev.touches[0].clientY
    const startX = touchStartEvent.touches[0].clientX
    const endX = ev.touches[0].clientX
    // 如果当次滚动判断完成则将结果存入state, 本次触摸事件不再判断
    let { isSlide } = this.state
    if (!isSlide) {
      isSlide = Math.abs(startY - endY) > Math.abs(startX - endX) ? 1 : -1
      this.setState({ isSlide })
    }
    if (isSlide === 1) {
      ev.stopPropagation()
    } else if (isSlide === -1) {
      ev.preventDefault()
    }
  }

  /**
   * 在每次触摸事件结束后释放事件句柄与state
   */
  handleTouchEnd = () => {
    document.removeEventListener('touchmove', this.handleTouchmove)
    document.removeEventListener('touchend', this.handleTouchEnd)
    this.setState({ touchStartEvent: null, isSlide: null })
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

  handleEndReached = () => {
    const { start, tag, count } = this.state
    const newStart = start + count
    this.generateData(newStart, tag, count)
    this.setState({ isLoading: true })
  }

  renderRow = (rowData, _, rowID) => (
    <div key={rowID} className={`${s.row} row`}>
      <p className={s.bigImg}><img src={rowData.images.small} alt={rowData.title} /></p>
      <div className={s.content}>
        <p className={s.title}>{rowData.title}</p>
        <p className={s.id}>id: {rowData.id}</p>
      </div>
    </div>
  )

  renderSeparator = (_, rowID) => (
    <div
      key={rowID}
      style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',
      }}
    />
  )

  render() {
    const { ds, height } = this.state
    return (
      <ListView
        ref={el => {
          this.lv = el
        }}
        initialListSize={10}
        dataSource={ds}
        renderHeader={() => <span>header</span>}
        renderFooter={() => (<div style={{ padding: '1rem', textAlign: 'center' }}>
          {this.state.isLoading ? 'Loading...' : 'Loaded'}
        </div>)}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        renderBodyComponent={() => <MyBody />}
        style={{
          height,
          overflow: 'auto',
        }}
        pageSize={4}
        scrollRenderAheadDistance={500}
        onEndReached={this.handleEndReached}
        onEndReachedThreshold={1500}
      />
    )
  }
}
