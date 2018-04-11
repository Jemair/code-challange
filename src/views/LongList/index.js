/* eslint-disable */
import React from 'react'
import ReactDOM from 'react-dom'
import {ListView} from 'antd-mobile'

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{display: 'none'}}>you can custom body wrap element</span>
      {props.children}
    </div>
  )
}

const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'abccccc',
    des: 'test',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'efafaf',
    des: 'testtesttesttest',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Eat the week',
    des: 'testtesttesttesttesttesttest',
  },
]
const NUM_SECTIONS = 5
const NUM_ROWS_PER_SECTION = 5
let pageIndex = 0

const dataBlobs = data
let sectionIDs = []
// let rowIDs = [0, 1, 2]

export default class LongList extends React.Component {
  constructor(props) {
    super(props)
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID]
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID]

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })

    this.state = {
      dataSource,
      isLoading: true,
      height: document.documentElement.clientHeight * 3 / 4,
    }
  }

  componentDidMount() {
    // you can scroll to the specified position

    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
      isLoading: false,
      height: hei,
    })
  }

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return
    }
    console.log('reach end', event)
    this.setState({isLoading: true})
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
      isLoading: false,
    })
  }

  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    )
    const row = (rowData, sectionID, rowID) => {
      /*if (index < 0) {
        index = data.length - 1
      }
      const obj = data[index--]
      return (
        <div key={rowID} style={{padding: '0 15px'}}>
          <div
            style={{
              lineHeight: '50px',
              color: '#888',
              fontSize: 18,
              borderBottom: '1px solid #F6F6F6',
            }}
          >{obj.title}</div>
          <div style={{display: '-webkit-box', display: 'flex', padding: '15px 0'}}>
            <img style={{height: '64px', marginRight: '15px'}} src={obj.img} alt=""/>
            <div style={{lineHeight: 1}}>
              <div style={{marginBottom: '8px', fontWeight: 'bold'}}>{obj.des}</div>
              <div><span style={{fontSize: '30px', color: '#FF6E27'}}>35</span>¥ {rowID}</div>
            </div>
          </div>
        </div>
      )*/
      return (
        <div key={rowID} style={{height: 200}}>
          asfhao;hf
        </div>
      )
    }

    return (
      <ListView
        ref={el => this.lv = el}
        dataSource={this.state.dataSource.cloneWithRows(data)}
        renderHeader={() => <span>header</span>}
        renderFooter={() => (<div style={{padding: 30, textAlign: 'center'}}>
          {this.state.isLoading ? 'Loading...' : 'Loaded'}
        </div>)}
        renderBodyComponent={() => <MyBody/>}
        renderRow={row}
        renderSeparator={separator}
        style={{height: this.state.height}}
        pageSize={4}
        onScroll={() => {
          console.log('scroll')
        }}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
      />
    )
  }
}
