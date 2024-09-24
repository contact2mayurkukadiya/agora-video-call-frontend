import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../shared/service/utility.service';
import AgoraRTC, { ClientConfig, IAgoraRTCClient, ICameraVideoTrack, ILocalAudioTrack, ILocalVideoTrack, IMicrophoneAudioTrack, UID } from "agora-rtc-sdk-ng";
import { AGORA_APP_ID } from '../shared/constant/app.constant';
import { AgoraService } from '../shared/service/agora.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-video-meeting',
  templateUrl: './video-meeting.component.html',
  styleUrls: ['./video-meeting.component.scss']
})
export class VideoMeetingComponent implements OnInit {

  agoraClientConfig: ClientConfig = {
    mode: "rtc",
    codec: "vp8",
  }

  client: any = null;
  name: string = '';
  meeting_id: string = '';
  localAudioTrack!: IMicrophoneAudioTrack;
  localVideoTrack!: ICameraVideoTrack;
  screenTrack!: ILocalVideoTrack;
  remoteUsers: Array<any> = [];
  isMuted: boolean = false;
  isSharingEnabled: boolean = false;
  isCameraEnabled: boolean = true;
  isCameraDetected: boolean = true;
  isMicDetected: boolean = true;
  isVideoCovered: boolean = true;

  constructor(
    public utility: UtilityService,
    public agoraService: AgoraService,
    public activeRoute: ActivatedRoute,
    public router: Router
  ) { }

  async ngOnInit() {
    this.activeRoute.params.subscribe(async (value: any) => {
      this.client = AgoraRTC.createClient(this.agoraClientConfig);
      this.meeting_id = value?.meeting_id;
      this.name = value?.uid;

      const { key: token } = await this.agoraService.generateToken(this.meeting_id, this.name, 0);
      this.connectMe(this.meeting_id, token, this.name);

      this.handleCallEvents();
    })
  }

  handleErrorCallback(err: any) {
    console.log("error", err)
  }

  connectMe(channel_name: string, token: string, name: string) {
    this.client.join(AGORA_APP_ID, channel_name, token, name).then(async (uid: UID) => {

      const myNameContainer = document.getElementById('my_name');
      myNameContainer ? myNameContainer.textContent = `${uid}` : null;

      forkJoin({
        isCameraEnabled: this.checkCameraAvailability(),
        hasMic: this.hasMicrophone()
      }).subscribe(async ({ isCameraEnabled, hasMic }) => {
        const tracks = [];
        if (isCameraEnabled) {
          this.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
          tracks.push(this.localVideoTrack);
          this.isCameraDetected = true;
          this.isCameraEnabled = false;
          this.toggleCamera();
        } else {
          this.isCameraDetected = false;
          this.isCameraEnabled = true;
          this.toggleCamera();
        }
        if (hasMic) {
          this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          tracks.push(this.localAudioTrack);
          this.isMicDetected = true;
          this.isMuted = true;
          this.toggleMic();
        } else {
          this.isMicDetected = false;
          this.isMuted = false;
          this.toggleMic();
        }

        await this.client.publish(tracks);
        if (this.localVideoTrack) {
          this.localVideoTrack.play('me');
        }
        console.log("publish success!");
      })
    }, this.handleErrorCallback)
  }

  handleCallEvents() {
    this.client.on("user-published", async (user: any, mediaType: any) => {
      await this.client.subscribe(user, mediaType);
      console.log("subscribe success", user.uid.toString(), this.client.uid.toString());
      if (user.uid.toString() != this.client.uid.toString()) {
        if (mediaType == "video") {
          const remoteUser = { videoTrack: user.videoTrack, audioTrack: user.audioTrack, uid: user.uid.toString() }
          remoteUser.videoTrack.play(`remote_user_${remoteUser.uid}`);
        }
        if (mediaType == "audio") {
          const remoteUser = { videoTrack: {}, audioTrack: user.audioTrack, uid: user.uid.toString() }
          remoteUser.audioTrack.play(`remote_user_${remoteUser.uid}`);
        }
      }

      this.client.on("user-unpublished", (user: any) => {
        console.log(user.uid + "has left the channel");
      });
    });
  }

  toggleMic() {
    if (this.isMuted) {
      // Unmute the channel
      this.isMuted = false;
      if (this.localAudioTrack)
        this.localAudioTrack.setMuted(false);
    } else {
      // Mute the channel
      this.isMuted = true;
      if (this.localAudioTrack)
        this.localAudioTrack.setMuted(true);
    }
  }

  toggleCamera() {
    if (this.isCameraEnabled) {
      // Disable the camera
      this.isCameraEnabled = false
      if (this.localVideoTrack)
        this.localVideoTrack.setEnabled(false);
    } else {
      // enable the camera
      this.isCameraEnabled = true
      if (this.localVideoTrack)
        this.localVideoTrack.setEnabled(true);
    }
  }

  leaveMeeting() {
    this.client.leave();
    if (this.localVideoTrack)
      this.localVideoTrack.close();
    if (this.localAudioTrack)
      this.localAudioTrack.close();
    this.isSharingEnabled ? this.stopSharing() : null;
    this.router.navigate(["/"]);
  }

  // async endMeeting() {
  //   const users = this.client.remoteUsers.map((item: any) => { return { user: item } })
  //   await this.client.massUnsubscribe(users);

  // }

  pinToFullScreen(user: any) {
    console.log('user: ' + user.uid);
    const fsContainer = document.getElementById('full-screen');
    const fsVideo = fsContainer?.firstChild;
    const targetvideo = document.getElementById(`remote_user_${user.uid}`);
    const otherContainer = document.getElementById('other');
    if (fsVideo) {
      otherContainer?.prepend(fsVideo);
      if (targetvideo)
        fsContainer?.appendChild(targetvideo);
    }
  }

  unPinToFullScreen(user: any) {
    console.log('user: ' + user.uid);
    const fsContainer = document.getElementById('full-screen');
    const fsVideo = fsContainer?.firstChild;
    const targetvideo = document.getElementById(`me`);
    const otherContainer = document.getElementById('other');
    if (fsVideo) {
      otherContainer?.prepend(fsVideo);
      if (targetvideo)
        fsContainer?.appendChild(targetvideo);
    }
  }

  async shareScreen() {
    if (this.isSharingEnabled == false) {
      this.screenTrack = (await AgoraRTC.createScreenVideoTrack({}, 'auto')) as ILocalVideoTrack;
      this.localVideoTrack.stop();
      await this.client.unpublish(this.localVideoTrack);
      await this.client.publish(this.screenTrack);
      this.screenTrack.play('me');
      this.isSharingEnabled = true;

      this.screenTrack.on('track-ended', () => { this.stopSharing() })
    }
  }

  async stopSharing() {
    if (this.isSharingEnabled == true) {
      this.screenTrack.stop();
      await this.client.unpublish(this.screenTrack);
      await this.client.publish(this.localVideoTrack);

      if (this.isCameraEnabled == true) {
        this.localVideoTrack.play('me');
      }
      this.isSharingEnabled = false;
      this.screenTrack.off('track-ended', () => { this.stopSharing() })
    }
  }

  copyText(text: string) {
    if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      var textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        return document.execCommand("copy");
      }
      catch (ex) {
        return prompt("Copy to clipboard: Ctrl+C, Enter", text);
      }
      finally {
        document.body.removeChild(textarea);
      }
    } else {
      return prompt("Copy to clipboard: Ctrl+C, Enter", text);
    }
  }

  async checkCameraAvailability() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoTracks = mediaStream.getVideoTracks();

      if (videoTracks.length > 0) {
        console.log("Camera is available.");
        return true;
      } else {
        console.log("No camera found.");
        return false;
      }
    } catch (error: any) {
      if (error.name === "NotFoundError" || error.name === "NotAllowedError") {
        console.log("Camera not found or access denied.");
      } else {
        console.error("Error accessing camera:", error);
      }
      return false;
    }
  }

  hasMicrophone() {
    return navigator.mediaDevices.enumerateDevices()
      .then(devices => devices.some(device => device.kind === 'audioinput'));
  }
}
