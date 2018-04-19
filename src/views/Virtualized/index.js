import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { Link, Route } from 'react-router-dom'
import { List as ImList, Map as ImMap } from 'immutable'
import { List } from 'react-virtualized'
import { fetchDoubanList } from '../../api'
import s from './index.styl'

export default class Virtualized extends PureComponent {
  state = {
    start: 0,
    count: 20,
    tag: '喜剧',
    list: ImList(),
    height: document.documentElement.clientHeight * 3 / 4,
    onEndReachedThreshold: 400,
    isLoading: false,
    imgLoaded: ImMap(),
  }

  componentDidMount() {
    this.generateData()
    this.setHeight()
  }

  /**
   * ListView在不以body为父元素时需要手动设置高度
   */
  setHeight = () => {
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.el).parentNode.offsetTop
    this.setState({
      height: hei,
    })
  }

  /**
   * 刷新数据并存入state
   */
  async generateData(start = 0, tag = '喜剧', count = 20) {
    const list = await fetchDoubanList({ start, tag, count })

    const { list: stList } = this.state
    const newList = stList.concat(list.subjects)

    this.setState({
      isLoading: false,
      start,
      list: newList,
    })
  }

  handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    const { onEndReachedThreshold } = this.state
    if (clientHeight + scrollTop + onEndReachedThreshold > scrollHeight) {
      this.handleEndReached()
    }
  }

  handleEndReached = () => {
    const { start, tag, count, isLoading } = this.state
    if (isLoading) { return }
    this.setState({ isLoading: true })
    this.generateData(start + count, tag, count)
  }

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const { list } = this.state
    const { match } = this.props
    console.log(match)
    const imageLoaded = JSON.parse(window.localStorage.getItem('imageLoaded')) || {}
    const { images, title, id } = list.get(index)
    let src = '//upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'
    if (imageLoaded[id]) {
      src = images.small
    }
    if (!isScrolling) {
      imageLoaded[id] = true
      src = images.small
      window.localStorage.setItem('imageLoaded', JSON.stringify(imageLoaded))
    }

    return (
      <Link to={`${match.path}/${id}`} key={key} style={style}>
        <div className={s.row}>
          <p className={s.bigImg}><img src={src} alt={title} /></p>
          <div className={s.content}>
            <p className={s.title}>{title}</p>
            <p className={s.id}>id: {id}</p>
          </div>
        </div>
        <p className={s.gap} />
      </Link>
    )
  }

  render() {
    const { list, height, isLoading } = this.state

    return (
      <div>
        <List
          ref={el => { this.el = el }}
          width={document.documentElement.clientWidth}
          height={height}
          rowCount={list.size}
          rowHeight={190}
          overscanRowCount={10}
          onScroll={this.handleScroll}
          rowRenderer={this.rowRenderer}
        />
        { isLoading && <div style={{ background: '#fff', lineHeight: '30px', textAlign: 'center' }}>Loading...</div> }
        <Route path=":id" component={props => { console.log(1); return <div>1</div> }} />
      </div>
    )
  }
}
