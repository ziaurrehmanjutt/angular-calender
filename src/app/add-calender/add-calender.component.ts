import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date:Date
}

@Component({
  selector: 'app-add-calender',
  templateUrl: './add-calender.component.html',
  styleUrls: ['./add-calender.component.css']
})
export class AddCalenderComponent {
  event: Event;

  constructor(
    public dialogRef: MatDialogRef<AddCalenderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date; event?: Event } // Optional event for editing
  ) {
    // Initialize event object
    this.event = data.event ? { ...data.event } : {
      id:this.generateUniqueId(),
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      date: data.date
    };
    this.event.date = data.date;
  }

  onSave(): void {
    this.dialogRef.close(this.event);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  generateUniqueId(): string {
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
}
