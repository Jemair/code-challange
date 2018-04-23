import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { Link, Route } from 'react-router-dom'
import { List } from 'react-virtualized'
import AnimatedWrapper from '../../components/AnimatedWrapper'
import { List as ImList, Map as ImMap } from 'immutable'
import { fetchDoubanList } from '../../api'
import Detail from '../Detail'
import s from './index.styl'

class Virtualized extends PureComponent {
  state = {
    start: 0,
    count: 20,
    tag: '喜剧',
    list: ImList(),
    height: document.documentElement.clientHeight * 3 / 4,
    onEndReachedThreshold: 600,
    endReached: false,
    isLoading: false,
    imgLoaded: ImMap(),
  }

  loadedTiming = []

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
      endReached: list.subjects.length === 0,
    })
  }

  /**
   * 监听滚动事件 当满足条件时触发handleEndReached方法
   * @param clientHeight
   * @param scrollHeight
   * @param scrollTop
   */
  handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    const { onEndReachedThreshold, list } = this.state
    if (clientHeight + scrollTop + onEndReachedThreshold > scrollHeight && list.size !== 0) {
      this.handleEndReached()
    }
  }

  /**
   * 当列表滚动到了末尾 触发该事件
   */
  handleEndReached = () => {
    const { start, tag, count, isLoading, endReached } = this.state
    if (isLoading || endReached) { return }
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
    const imageLoaded = JSON.parse(window.localStorage.getItem('imageLoaded')) || {}
    const { images, title, id } = list.get(index)
    let src = '//upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'

    // 如果已经加载过该图片 则直接加载
    if (imageLoaded[id]) {
      src = images.small
      this.loadedTiming[index] = Date.now()

      // 如果用户在滑动过程中 暂停加载图片 等用户停止滑动再进行加载
    } else if (!isScrolling) {
      imageLoaded[id] = true
      this.loadedTiming[index] = Date.now()
      src = images.small
      window.localStorage.setItem('imageLoaded', JSON.stringify(imageLoaded))

      // 如果每4条数据之间加载的速度多于200ms 说明用户滑动速度很慢 依然加载图片
    } else if (index > 5 && isVisible && Math.abs(Date.now() - Math.abs(this.loadedTiming[index - 4])) > 200) {
      src = images.small
      imageLoaded[id] = true
      this.loadedTiming[index] = Date.now()
      window.localStorage.setItem('imageLoaded', JSON.stringify(imageLoaded))

      // 如果不满足上述每一条件 则说明用户再以极快速度上拉 暂停加载图片
    } else {
      this.loadedTiming[index] = -Date.now()
    }

    return (
      <Link to={`${match.url}/detail/${id}`} key={key} style={style}>
        <div className={s.row}>
          <p className={s.bigImg}><img src={src} alt={title} /></p>
          <div className={s.content}>
            <p className={s.title}>{title}</p>
            <p className={s.id}>id: {id}</p>
            <p>row: {index}</p>
          </div>
        </div>
        <p className={s.gap} />
      </Link>
    )
  }

  static renderAdditional(props) {
    const { match } = props
    return <Route path={`${match.url}/detail/:id`} component={Detail} />
  }

  render() {
    const { list, height } = this.state

    return (
      <div>
        <div>
          <List
            ref={el => { this.el = el }}
            width={document.documentElement.clientWidth}
            height={height}
            rowCount={list.size}
            rowHeight={160}
            overscanRowCount={10}
            onScroll={this.handleScroll}
            rowRenderer={this.rowRenderer}
          />
        </div>
      </div>
    )
  }
}

export default AnimatedWrapper(Virtualized)
