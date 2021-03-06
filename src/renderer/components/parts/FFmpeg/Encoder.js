var spawn = require('child_process').spawn
var Stream = require('stream')
const EventEmitter = require('events')

export default class Encoder extends EventEmitter {
  constructor ({ music = false, output = 'out.mp4' }) {
    super()

    this.passThrough = new Stream.PassThrough()
    this.promise = new Promise((resolve, reject) => {
      var args = []

      args = args.concat([
        '-y',
        // '-f', 'image2pipe',
        // raw 1080 pixel
        '-f', 'rawvideo', '-vcodec', 'rawvideo', '-s', '1080x1080', '-pix_fmt', 'rgba', '-r', '60',
        '-i', 'pipe:0'
      ])

      if (music) {
        args = args.concat([
          '-i', music
        ])
      }

      args = args.concat([

        '-shortest',

        // '-q:v', '1',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-pix_fmt', 'yuv420p',
        // '-crf', '18',
        '-crf', '18',
        '-movflags', 'frag_keyframe+empty_moov',
        '-framerate', '60',

        '-f', 'mp4',

        output
        // 'pipe:1'

      ])

      this.ffmpegProcess = spawn('ffmpeg', args)

      this.ffmpegProcess.stderr.on('data', (data) => {
        var buff = Buffer.from(data)
        let str = buff.toString('utf8')
        console.log(str)
        this.emit('console', str)
      })

      // this.ffmpegProcess.stderr.on('end', function(data){
      //   // var buff = new Buffer(data);
      //   // console.log(buff.toString('utf8'));
      // });

      this.ffmpegProcess.stderr.pipe(process.stdout)
      this.passThrough.pipe(this.ffmpegProcess.stdin)

      // var buffers = [];
      // this.ffmpegProcess.stdout.on('data', (dataBuffers) => {
      //   buffers.push(dataBuffers);
      // });
      this.ffmpegProcess.stdout.on('end', () => {
        this.emit('done', { output })
        this.ffmpegProcess.kill()
        resolve({ output })
      })
    })
  }

  // var base64 = self.canvas2D.getBase64();
  // addBuffer({ buffer: new Buffer(base64, 'base64'), shouldClose: shouldClose, next: processNextTick });
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
