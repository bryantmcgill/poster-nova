import * as rasterizeHTML from 'rasterizehtml'
import * as THREE from 'three'

export default class TextTexture {
  constructor () {
    this.options = {
      width: 2048,
      height: 2048
    }
    this.canvas = document.createElement('canvas')

    this.canvas.width = this.options.width
    this.canvas.height = this.options.height

    this.canvas.style.maxWidth = '100%'
    this.canvas.style.maxHeight = '100%'

    this.id = Math.random() * 2048
    this.textClassName = `render-center-${this.id.toFixed(0)}`
    this.containerClassName = `container-${this.id.toFixed(0)}`
    this.textBoxClassName = `text-box-${this.id.toFixed(0)}`
  }

  render ({ text, box, container }) {
    this.html = `
      <div class="${this.containerClassName}"><div class="${this.textBoxClassName}">${text}</div>
        <style>
        .${this.containerClassName}{
          ${container}
        }
        .${this.textBoxClassName} {
          ${box}
        }
      </style></div>
    `

    // var doc = document.implementation.createHTMLDocument('')
    // doc.write(this.html)

    // // You must manually set the xmlns if you intend to immediately serialize
    // // the HTML document to a string as opposed to appending it to a
    // // <foreignObject> in the DOM
    // doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI)

    // // Get well-formed markup
    // let html = (new XMLSerializer()).serializeToString(doc)

    this.ctx = this.canvas.getContext('2d')
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    return rasterizeHTML.drawHTML(this.html, this.canvas, this.options)
      .then(({ image, svg, errors }) => {
        let texture = new THREE.CanvasTexture(this.canvas)
        texture.needsUpdate = true
        return {
          image, svg, errors, canvas: this.canvas, texture
        }
      }, ({ message, originalError }) => {
        return {
          message,
          error: originalError
        }
      })
  }
}
