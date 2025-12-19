 # 📹 Agora Video Call Sample
 
 [![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
 ![Agora RTC](https://img.shields.io/badge/Agora%20RTC-4.15.1-2E7CF6?style=for-the-badge&logo=agora)
 ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.2-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
 
 **Angular + Agora Web SDK** video meeting experience with meeting creation, join flow, mic/cam controls, and screen sharing.
 
 ## 🎥 Live Preview
 
 - [**Live Site**](https://contact2mayurkukadiya.github.io/agora-video-call-frontend/)
 - [**Sample Video**](https://drive.google.com/file/d/1e8twfmhjO9UBJ3_kZzXC6edG8oA_-X7L/view?usp=share_link)
   
 
 ## ✨ Overview
 
 This project is a simple meeting platform built with Angular and `agora-rtc-sdk-ng`.
 
 ## ✅ Features
 
 - **🆕 Create meeting**: generates a random channel id and joins.
 - **🔗 Join meeting**: join an existing channel id.
 - **🎙️ Mic control**: mute/unmute microphone.
 - **📷 Camera control**: enable/disable camera.
 - **🖥️ Screen sharing**: publish a screen track and switch back to camera.
 - **🧷 Pin / Unpin**: move a participant tile into a larger “full screen” area.
 
 ## 🧰 Tech Stack
 
 - **Framework**: Angular `^14.0.0`
 - **Language**: TypeScript `~4.7.2`
 - **RTC**: Agora Web SDK (`agora-rtc-sdk-ng` `^4.15.1`)
 - **UI**: Bootstrap `^5.2.0` + `@ng-bootstrap/ng-bootstrap` `^13.0.0`
 - **Routing**: Hash routing enabled (`useHash: true`) for static hosting
 
 ## ⚡ Quick Start
 
 ### 1) Install dependencies
 
 ```bash
 npm install
 ```
 
 ### 2) Run locally
 
 ```bash
 npm start
 ```
 
 The app runs via `ng serve -o`.
 
 ## 🔐 Agora Token Flow
 
 This frontend **does not generate Agora RTC tokens** locally.
 
 It fetches a token from:
 - `GET https://agora-video-call-backend.onrender.com/rtcToken?channelName=<channelName>&uid=<uid>`
 
 If you want to use your own Agora project:
 - **Update Agora App ID** in:
   - `src/environments/environment.ts`
   - `src/environments/environment.prod.ts`
 - **Update token server URL** in:
   - `src/app/shared/service/agora.service.ts`
 
 ## 🧭 Routes
 
 - **Home**: `/#/`
 - **Meeting**: `/#/video/:meeting_id/:uid`
 
 Example:
 
 ```
 http://localhost:4200/#/video/my-meeting-id/john
 ```
 
 ## 🏗️ Build & Deploy
 
 ### Build
 
 ```bash
 npm run build
 ```
 
 This project builds with `--base-href './'` which is suitable for GitHub Pages / static hosting.
 
 ### Notes
 
 - Hash-based routing (`useHash: true`) is used to avoid 404s on static hosts.
 - The build output folder is `dist/agora-video-call-sample`.
 
 ## 🛠️ Troubleshooting
 
 - **Camera/mic not working**
   - Allow permissions in the browser.
   - Ensure you have devices connected and not used exclusively by another app.
 - **Token errors / join fails**
   - Confirm your token server is reachable and returns a valid token.
   - Confirm `AGORA_APP_ID` matches the Agora project used to generate the token.
 - **Screen share stops**
   - If the user ends sharing from the browser UI, the app listens for `track-ended` and switches back.
 
 ## 🛡️ Security Notes
 
 - **Never expose your Agora App Certificate in the frontend.**
 - Token generation must always happen on a backend you control.
 
 
 [comment]: <> (angular-cli-ghpages --dir=dist/agora-video-call-sample -r git@github-contact2mayurkukadiya:contact2mayurkukadiya/agora-video-call-frontend.git)
