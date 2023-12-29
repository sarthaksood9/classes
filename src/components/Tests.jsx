import React, { useState } from 'react'
import axios from "axios"

const Tests = () => {
    const [src,setSrc]=useState('');
    async function init() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // document.getElementById("video").srcObject = stream;
        setSrc(stream);
        const peer = createPeer();
        stream.getTracks().forEach(track => peer.addTrack(track, stream));
    }

    function createPeer() {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                }
            ]
        });
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
    
        return peer;
    }
    
    async function handleNegotiationNeededEvent(peer) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        const payload = {
            sdp: peer.localDescription
        };
    
        const { data } = await axios.post('/broadcast', payload);
        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch(e => console.log(e));
    }

  return (
    <>
    <button onClick={()=>{
        init();
    }}>
        start
    </button>
    <video autoPlay src={src}></video>
    </>
  )
}

export default Tests