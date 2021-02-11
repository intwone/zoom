class Business {
  constructor({ room, media, view, socketBuilder, peerBuilder }) {
    this.room = room
    this.media = media
    this.view = view
    
    this.socketBuilder = socketBuilder
    this.peerBuilder = peerBuilder

    this.socket = {  }
    this.currentStream = {  }
    this.currentPeer = {  }
  }

  static initialize(dependencies) {
    const instance = new Business(dependencies)

    return instance._init()
  }

  async _init() {
    this.currentStream = await this.media.getCamera()

    this.socket = this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .build()

    this.currentPeer = this.peerBuilder
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .build()

    this.addVideoStream('test01')
  }

  addVideoStream(userID, stream = this.currentStream) {
    const isCurrentID = false
    
    this.view.renderVideo({
      userID,
      stream,
      isCurrentID
    }) 
  }

  onUserConnected = function() {
    return (userID) => {
      console.log('user-connected!', userID)
    }
  }

  onUserDisconnected = function() {
    return (userID) => {
      console.log('user-disconnected!', userID)
    }
  }

  onPeerError = function() {
    return (error) => {
    console.log('error on peer!', error)
    }
  }

  onPeerConnectionOpened = function() {
    return (peer) => {
      const id = peer.id 
      console.log('peer!!!', peer);
      this.socket.emit('join-room', this.room, id)
    }
  }
}