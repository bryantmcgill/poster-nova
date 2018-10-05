var spawn = require('child_process').spawn
var Stream = require('stream')
const EventEmitter = require('events')

export default class Decoder extends EventEmitter {
  constructor ({ input = 'in.mp4', resolution }) {
    super()

    this.passThrough = new Stream.PassThrough()

    this.promise = new Promise((resolve, reject) => {
      var args = []

      // ['ffmpeg','-i','blue.mp4','-f','rawvideo','-vcodec','rawvideo','-s','1080x1080','-pix_fmt','rgba']
      args = args.concat([
        '-y',

        // '-f', 'image2pipe',
        // raw 1080 pixel

        '-i', input
      ])

      // if (music){
      //   args = args.concat([
      //     '-i', music,
      //   ])
      // }

      args = args.concat([
        // '-shortest',

        // //'-q:v', '1',
        // '-c:v', 'libx264',
        // '-c:a', 'aac',
        // '-pix_fmt', 'yuv420p',
        // '-crf', '18',
        // '-movflags', 'frag_keyframe+empty_moov',
        // '-framerate', '60',

        // '-f', 'image2pipe',
        // '-vcodec', 'rawvideo', '-s', '1080x1080', '-pix_fmt', 'rgba',

        '-f', 'image2pipe', '-vcodec', 'rawvideo', '-s',
        // '1080x1080',
        resolution,
        '-pix_fmt', 'rgba', '-r', '60',

        // '-f', 'mp4',

        // output,
        '-'
      ])

      this.ffmpegProcess = spawn('ffmpeg', args)

      this.ffmpegProcess.stderr.on('data', (data) => {
        var buff = Buffer.from(data)
        let str = buff.toString('utf8')
        console.log('decoder', str)
        this.emit('console', str)
      })

      // this.ffmpegProcess.stderr.on('end', function(data){
      //   // var buff = new Buffer(data)
      //   // console.log(buff.toString('utf8'));
      // });

      this.ffmpegProcess.stderr.pipe(process.stdout)

      // this.ffmpegProcess.stdout.pipe(this.passThrough);

      // var magic = false
      // var frameParts = []
      let numOfPixels = resolution.split('x')[0] * resolution.split('x')[1] * 4
      let cursor = 0
      var bucket = []
      this.ffmpegProcess.stdout.on('data', (buffer) => {
        bucket.push(buffer)
        cursor += buffer.length

        if (cursor >= numOfPixels) {
          let extraLargeBuffer = Buffer.concat(bucket)
          bucket = []

          let rightFrame = extraLargeBuffer.slice(0, numOfPixels)

          this.emit('frame', { frame: rightFrame })
          let remainBuffer = extraLargeBuffer.slice(numOfPixels, extraLargeBuffer.length)
          bucket.push(remainBuffer)

          cursor -= numOfPixels
        }
      })

      // var buffers = [];
      // this.ffmpegProcess.stdout.on('data', (dataBuffers) => {
      //   buffers.push(dataBuffers);
      // });
      this.ffmpegProcess.stdout.on('end', () => {
        this.emit('done', { input })
        this.ffmpegProcess.kill()
        resolve({ input })
      })
    })
  }

  addBuffer ({ buffer, shouldClose, next }) {
    this.passThrough.write(buffer, () => {
      if (shouldClose) {
        this.passThrough.end()
      } else {
        if (next) {
          next()
        }
      }
    })
  }

  kill () {
    this.ffmpegProcess.kill()
  }
}
