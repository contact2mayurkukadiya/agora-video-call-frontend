import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../shared/service/utility.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  joinMeetingInput: boolean = false;
  createMeetingInput: boolean = false;
  newHostName: string = '';
  meeting_id: string = '';

  constructor(
    public router: Router,
    public utility: UtilityService,
  ) {

  }

  ngOnInit(): void {
  }

  async startNewMeeting() {
    if (this.newHostName) {
      const channel_name = this.utility.getRandomId(20);
      const uid = this.newHostName;
      this.createMeetingInput = false;
      this.router.navigate(['/video', channel_name, uid]);
    } else {
      console.log('host name not available');
    }
  }

  joinExistingMeeting() {
    if (this.newHostName && this.meeting_id) {
      const channel_name = this.meeting_id;
      const uid = this.newHostName;
      this.joinMeetingInput = false;
      this.router.navigate(['/video', channel_name, uid]);
    } else {
      console.log('Host Name or Meeting Id not available');
    }
  }

}
