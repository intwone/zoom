class Business {
  constructor({ room, media, view, socketBuilder }) {
    this.room = room
    this.media = media
    this.view = view
    this.socketBuilder = socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .build()

    this.socketBuilder.emit('join-room', this.room, 'teste01')
    this.currentStream = { }
  }

  static initialize(dependencies) {
    const instance = new Business(dependencies)

    return instance._init()
  }

  async _init() {
    this.currentStream = await this.media.getCamera()
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
      console.log('user-discnnected!', userID)
    }
  }
}