export default ((docs, win) => {
  const docEls = docs.documentElement
  const resizeEvts = 'orientationchange' in window ? 'orientationchange' : 'resize'
  const recalcs = function() {
    window.rem = docEls.getBoundingClientRect().width / 37.5
    docEls.style.fontSize = window.rem + 'px'
  }
  recalcs()
  if (!docs.addEventListener) {
    return
  }
  win.addEventListener(resizeEvts, recalcs, false)
})(document, window)
