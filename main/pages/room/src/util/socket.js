class SocketBuilder {
  constructor({ socketURL }) {
    this.socketURL = socketURL
    this.onUserConnected = () => {  }
    this.onUserDisconnected = () => {  }
  }

  setOnUserConnected(fn) {
    this.onUserConnected = fn
    return this
  }

  setOnUserDisconnected(fn) {
    this.onUserDisconnected = fn
    return this
  }

  build() {
    const socket = io.connect(this.socketURL, {
      withCredentials: false
    })

    socket.on('user-connected', this.onUserConnected)
    socket.on('user-desconnected', this.onUserDisconnected)

    return socket
  }
}