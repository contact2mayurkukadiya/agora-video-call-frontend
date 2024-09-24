import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VideoMeetingComponent } from './video-meeting/video-meeting.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'video/:meeting_id/:uid',
    component: VideoMeetingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
