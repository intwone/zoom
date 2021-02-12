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

    this.peers = new Map()
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

    this.currentPeer = await this.peerBuilder
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .setOnCallReceived(this.onPeerCallReceived())
      .setOnPeerStreamReceived(this.onPeerStreamReceived())
      .setOnCallError(this.onPeerCallError())
      .setOnCallClose(this.onPeerCallClose())
      .build()

    this.addVideoStream(this.currentPeer.id)
  }

  addVideoStream(userID, stream = this.currentStream) {
    const isCurrentID = false
    
    this.view.renderVideo({
      userID,
      stream,
      isCurrentID
    }) 
  }

  onUserConnected() {
    return (userID) => {
      console.log('user-connected!', userID)
      this.currentPeer.call(userID, this.currentStream)
    }
  }

  onUserDisconnected() {
    return (userID) => {
      console.log('user-disconnected!', userID)

      if(this.peers.has(userID)) {
        this.peers.get(userID).call.close()
        this.peers.delete(userID)
      }

      this.view.setParticipants(this.peers.size)
      this.view.removeVideoElement(userID)
    }
  }

  onPeerError() {
    return (error) => {
    console.log('error on peer!', error)
    }
  }

  onPeerConnectionOpened() {
    return (peer) => {
      const id = peer.id 
      console.log('peer!!!', peer);
      this.socket.emit('join-room', this.room, id)
    }
  }

  onPeerCallReceived() {
    return (call) => {
      console.log('answering call', call)
      call.answer(this.currentStream)
    }
  }

  onPeerStreamReceived() {
    return (call, stream) => {
      const callerID = call.peer
      this.addVideoStream(callerID, stream)  
      this.peers.set(callerID, { call })
      this.view.setParticipants (this.peers.size)
    }
  }

  onPeerCallError() {
    return (call, error) => {
      console.log('an call error ocurred!', error)
      this.view.removeVideoElement(call.peer)
    }
  }

  onPeerCallClose() {
    return (call) => {
      console.log('call closed!', call.peer)
    }
  }
}