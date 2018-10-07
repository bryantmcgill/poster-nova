var path = require('path')

var ComposDB = {}
let vueCTX = require.context('./', true, /\.vue$/)
vueCTX.keys().forEach((link) => {
  ComposDB[path.basename(link).replace('.vue', '')] = vueCTX(link).default
})

export const Compos = ComposDB

export const Decoder = require('./FFmpeg/Decoder.js').default
export const Encoder = require('./FFmpeg/Encoder.js').default
export const Renderer = require('./Renderer/Renderer.js').default
export const Timeline = require('./Renderer/Timeline.js').default
export const VideoRenderer = require('./Renderer/VideoRenderer.js').default
export const Specs = require('./Specs/Specs.js').default

export const RenderableUpdater = require('./RenderableUpdater/RenderableUpdater.vue').default
