import { Injectable } from '@angular/core';
import { AGORA_APP_ID, AGORA_CERTIFICATE } from '../constant/app.constant';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AgoraService {

  constructor(public api: ApiService) { }

  generateToken(channelName: string, uid: number | string, role: number = 0) {
    return this.api.Get(`https://agora-video-call-backend.onrender.com/rtcToken?channelName=${channelName}&uid=${uid}`, {}).then(result => {
      return result;
    })
    // const expirationTimeInSeconds = 3600
    // const currentTimestamp = Math.floor(Date.now() / 1000)
    // const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    // const token = RtcTokenBuilder.buildTokenWithUid(AGORA_APP_ID, AGORA_CERTIFICATE, channelName, uid, role, privilegeExpiredTs);
    // return token
  }
}
