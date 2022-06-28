import React from "react"
// eslint-disable-next-line
import adapter from "webrtc-adapter"

function App() {
  const pc = React.useRef()
  const textRef = React.useRef()

  const remoteAudio = document.createElement("audio")
  remoteAudio.volume = 0.5
  remoteAudio.autoplay = true

  console.log(remoteAudio)

  const setPC = (localStream) => {
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
    localStream.getTracks().forEach((track) => {
      pc.current.addTrack(track, localStream)
    })
    pc.current.onicecandidate = (e) => {
      if (e.candidate) {
        console.log(JSON.stringify(e.candidate))
      }
    }
    pc.current.oniceconnectionstatechange = (e) => {
      console.log(e, pc.current.connectionState)
    }
    pc.current.ontrack = (e) => {
      remoteAudio.srcObject = e.streams[0]
    }
  }

  const useInBuldCamera = async () => {
    const constraints = {
      audio: true,
      video: false,
    }
    try {
      const localStream = await navigator.mediaDevices.getUserMedia(constraints)
      setPC(localStream)
    } catch (e) {
      console.log(e)
    }
  }

  const setVirtualCamera = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    let constraints = {
      audio: true,
      video: false,
    }
    console.log(devices)
    // devices.forEach((device) => {
    //   if (device.label === "Droidcam") {
    //     constraints = { audio: false, video: { deviceId: device.deviceId } }
    //   }
    // })
    try {
      const localStream = await navigator.mediaDevices.getUserMedia(constraints)
      // localAudioRef.current.srcObject = localStream
      setPC(localStream)
    } catch (e) {
      console.log(e)
    }
  }

  const createOffer = async () => {
    const sdp = await pc.current.createOffer()
    console.log(JSON.stringify(sdp))
    await pc.current.setLocalDescription(sdp)
  }

  const createAnswer = async () => {
    const sdp = await pc.current.createAnswer()
    console.log(JSON.stringify(sdp))
    await pc.current.setLocalDescription(sdp)
  }

  const setRemoteDescription = async () => {
    const sdp = JSON.parse(textRef.current.value)
    await pc.current.setRemoteDescription(new RTCSessionDescription(sdp))
  }

  const addCandidate = async () => {
    const candidate = JSON.parse(textRef.current.value)
    await pc.current.addIceCandidate(new RTCIceCandidate(candidate))
  }

  return (
    <div style={{ margin: 10 }}>
      <div>
        <button onClick={useInBuldCamera}>Use in-build camera</button>
        <button onClick={setVirtualCamera}>Use virtual camers</button>
      </div>
      {/* <audio
        style={{ width: 360, height: 240, margin: 5, backgroundColor: "black" }}
        autoPlay
        controls
        muted
        ref={localAudioRef}
      /> */}
      {/* <audio
        style={{ width: 360, height: 240, margin: 5, backgroundColor: "black" }}
        autoPlay
        controls
        ref={remoteAudioRef}
      /> */}
      <br />
      <button onClick={createOffer}>Create Offer</button>
      <button onClick={createAnswer}>Create Answer</button>
      <br />
      <textarea style={{ width: 400, height: 200 }} ref={textRef}></textarea>
      <br />
      <button onClick={setRemoteDescription}>Set Remote Description</button>
      <button onClick={addCandidate}>Add Candidates</button>
    </div>
  )
}

export default App
