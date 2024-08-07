import { Component, InjectionToken,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Event {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}




@Component({
  selector: 'app-add-calender',
  templateUrl: './add-calender.component.html',
  styleUrl: './add-calender.component.css'
})


export class AddCalenderComponent {
  event: Event = {
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  };

  constructor(
    public dialogRef: MatDialogRef<AddCalenderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date }
  ) {
    // Set default date in event object
    this.event.startTime = '';
    this.event.endTime = '';
  }

  onSave(): void {
    // Format start and end time with the date
    if (this.event.startTime && this.event.endTime) {
      const date = this.data.date;
      this.event.startTime = `${this.formatDate(date)}T${this.event.startTime}`;
      this.event.endTime = `${this.formatDate(date)}T${this.event.endTime}`;
    }
    this.dialogRef.close(this.event);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
// function Inject(MAT_DIALOG_DATA: InjectionToken<any>): (target: typeof AddCalenderComponent, propertyKey: undefined, parameterIndex: 1) => void {
//   throw new Error('Function not implemented.');
// }

