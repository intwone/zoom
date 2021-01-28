class Business {
  constructor({ room, media, view }) {
    this.room = room
    this.media = media
    this.view = view

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
}