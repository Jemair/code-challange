import React, { PureComponent } from 'react'
import IframeComponent from '../../components/Iframe'
import s from './index.styl'

export default class Iframe extends PureComponent {
  render() {
    return (
      <IframeComponent url="http://m.bilibili.com/index.html"
        className={s.iframe}
        width="100%"
        height="100%"
        display="initial"
        position="relative"
        allowFullScreen />
    )
  }
}
