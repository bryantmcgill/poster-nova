// sepcs is data only
export default class Specs {
  constructor () {
    this.items = []
    this.trashBin = []
    this.hydrate()
    this.maxTime = 60
  }
  hydrate () {
    let itemsFromLS = window.localStorage.getItem('poster-nova-specs-items')
    if (itemsFromLS) {
      this.items = JSON.parse(itemsFromLS)
    } else {
      this.items = [
        this.makeSimpleText()
      ]
    }

    let trashFromLS = window.localStorage.getItem('poster-nova-specs-trash')
    if (trashFromLS) {
      this.trashBin = JSON.parse(trashFromLS)
    } else {
      this.trashBin = []
    }
  }
  sort () {
    let handler = (a, b) => {
      return a.start - b.start
    }
    this.renderer.sort(handler)
  }
  save () {
    this.saveToLS()
  }
  saveToLS () {
    window.localStorage.setItem('poster-nova-specs-trash', JSON.stringify(this.trashBin))
    window.localStorage.setItem('poster-nova-specs-items', JSON.stringify(this.items))
  }
  addTop (item) {
    this.items.unshift(item)
  }
  addBottom (item) {
    this.items.push(item)
  }
  trash ({ spec }) {
    let idx = this.items.findIndex(i => i.id === spec.id)
    this.items.splice(idx, 1)
    this.trashBin.push(spec)
  }
  remove ({ spec }) {
    let idx = this.trashBin.findIndex(i => i.id === spec.id)
    this.trashBin.splice(idx, 1)
    this.saveToLS()
  }
  restore ({ spec }) {
    let idx = this.trashBin.findIndex(i => i.id === spec.id)
    this.trashBin.splice(idx, 1)
    this.addBottom(spec)
  }
  clone ({ spec }) {
    let newSepc = JSON.parse(JSON.stringify(spec))
    newSepc = {
      ...newSepc,
      id: '_' + (Math.random() * 8192000).toFixed(0)
    }
    this.addBottom(newSepc)
  }
  makeFrameSetInfo () {
    return {
      start: 2,
      afterStart: 4,
      beforeEnd: 8,
      end: 10
    }
  }
  makeSimpleText () {
    let fs = this.makeFrameSetInfo()
    console.log(fs)
    return {
      id: '_' + (Math.random() * 8192000).toFixed(0),
      ClassName: 'SimpleText',
      text: 'happy happy happy happy happy happy happy happy happy happy happy \nhappy happy happy happy happy happy happy happy happy ',
      container: `/* container css */
/* container, max 2048px */
margin: 0px;
box-sizing: border-box;
border: red solid 20px;
width: 2048px;
height: 2048px;

/* center the text box */
display: flex;
justify-content: center;
align-items: center;
      `,
      box: `/* text-box css */

/* center text */
display: flex;
justify-content: center;
align-items: center;

margin: 0px;
box-sizing: border-box;
border: red solid 20px;
width: 1024px;
height: 1024px;

text-align: center;
font-size: 100px;

font-family: 'Bodoni 72';
white-space: pre-line;
`,
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      rotation: { x: 0, y: 0, z: 0 },

      ...fs
    }
  }
}
