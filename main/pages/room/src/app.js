const recordClick = function (recorderBtn) {
  this.recordingEnabled = false
  return () => {
    this.recordingEnabled = !this.recordingEnabled
    recorderBtn.style.color = this.recordingEnabled ? 'red' : 'white'
  }
}

const onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const room = urlParams.get('room');
  console.log('this is the room', room)

  // const recorderBtn = document.getElementById('record')
  // recorderBtn.addEventListener('click', recordClick(recorderBtn))

  /**
   * Transforma determinado objeto em um array contendo valores de cada chave
   */
  const peerConfig = Object.values({
    id: undefined,
    config: {
      port: 9000,
      host: 'localhost',
      path: '/'
    }
  })

  const socketURL = 'http://localhost:3000'
  
  const peerBuilder = new PeerBuilder({ peerConfig })
  const socketBuilder = new SocketBuilder({ socketURL })
  const view = new View()
  const media = new Media()

  const dependencies = {
    room,
    media, 
    view,
    socketBuilder, 
    peerBuilder
  }

  Business.initialize(dependencies)
}

window.onload = onload