class View {
  constructor() {
    this.recorderButton = document.getElementById('record')
    this.leaveButton = document.getElementById('leave')
  }

  createVideoElement({ muted = true, src, srcObject }) {
    const video = document.createElement('video')
    video.muted = muted
    video.src = src
    video.srcObject = srcObject
    
    if(src) {
      video.controls = true
      video.loop = true
      Util.sleep(200).then(_ => video.play())
    }

    if(srcObject) {
      video.addEventListener('loadedmetadata', _ => video.play())
    }
    
    return video
  }

  renderVideo({ userID, stream = null, url = null, isCurrentID = false}) {
    const video = this.createVideoElement({ 
      muted: isCurrentID,
      src: url, 
      srcObject: stream 
    })
    this.appendToHTMLTree(userID, video, isCurrentID)
  }

  appendToHTMLTree(userID, video, isCurrentID) {
    const div = document.createElement('div')
    div.id = userID

    div.classList.add('wrapper')
    div.append(video)

    const div2 = document.createElement('div') 
    const currentID = isCurrentID ? '' : userID
    div2.innerText = currentID
    div.append(div2)

    const videoGrid = document.getElementById('video-grid')
    videoGrid.append(div)
  }

  setParticipants(count) {
    const myself = 1 
    const participants = document.getElementById('participants')
    participants.innerHTML = count + myself
  }

  removeVideoElement(id) {
    const element = document.getElementById(id)
    element.remove()
  }

  toggleRecordingButtonColor(isActive = true) {
    this.recorderButton.style.color = isActive ? 'red' : 'white'
  }

  onRecordClick(command) {
    this.recordingEnabled = false
    return () => {
      const isActive = this.recordingEnabled = !this.recordingEnabled

      command(this.recordingEnabled)

      this.toggleRecordingButtonColor(isActive)
    }
  }

  onLeaveClick(command) {
    return async () => {
      command()

      await Util.sleep(1000)

      window.location = '/pages/home'
    }
  }

  configureRecordButton(command) {
    this.recorderButton.addEventListener('click', this.onRecordClick(command)) 
  }

  configureLeaveButton(command) {
    this.leaveButton.addEventListener('click', this.onLeaveClick(command)) 
  }
}