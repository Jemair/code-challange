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

  componentDidMount() {
    this.generateData()
    this.setHeight()
  }

  componentWillUpdate() {
    const { match, location } = this.props
    if (match.url !== location.pathname) {
      return false
    }
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
    const { match, location } = this.props
    if (match.url !== location.pathname) {
      return
    }
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

  handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    const { onEndReachedThreshold, list } = this.state
    if (clientHeight + scrollTop + onEndReachedThreshold > scrollHeight && list.size !== 0) {
      this.handleEndReached()
    }
  }

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
    if (imageLoaded[id]) {
      src = images.small
    }
    if (!isScrolling) {
      imageLoaded[id] = true
      src = images.small
      window.localStorage.setItem('imageLoaded', JSON.stringify(imageLoaded))
    }

    return (
      <Link to={`${match.url}/detail/${id}`} key={key} style={style}>
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
