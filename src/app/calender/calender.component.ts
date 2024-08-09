import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCalenderComponent } from '../add-calender/add-calender.component';
// import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday } from 'date-fns';
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css'
})
export class CalenderComponent {


  isDailyView: boolean = false;
  draggedEvent: any = null;
  draggedFromDate: Date | null = null;
  currentMonth: Date = new Date();
  days: Date[] = [];
  weeks: Date[][] = [];
  events: { [key: string]: any[] } = {};  // Event storage
  hours: string[] = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  constructor(public dialog: MatDialog) { }
  eventsForDay: { [key: string]: any[] } = {};  // Events organized by hour
  minutes: string[] = Array.from({ length: 6 }, (_, i) => (i * 10).toString().padStart(2, '0'))
  draggedFromTime: { hour: string, minute: string } | null = null;
  ngOnInit() {
    this.updateCalendar();
  }

  updateCalendar() {
    this.setupMonthlyView();
  }


  setupMonthlyView() {
    const start = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const end = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    const startWeek = new Date(start);
    startWeek.setDate(startWeek.getDate() - startWeek.getDay());

    const endWeek = new Date(end);
    endWeek.setDate(endWeek.getDate() + (6 - endWeek.getDay()));

    this.days = [];
    for (let d = new Date(startWeek); d <= endWeek; d.setDate(d.getDate() + 1)) {
      this.days.push(new Date(d));
    }

    this.weeks = [];
    let week: Date[] = [];
    this.days.forEach(day => {
      if (day.getDay() === 0 && week.length) {
        this.weeks.push(week);
        week = [];
      }
      week.push(day);
    });

    if (week.length) {
      this.weeks.push(week);
    }
  }

  prevMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.updateCalendar();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.updateCalendar();
  }

  formatDate(date: Date): string {
    return date?.getDate().toString();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
  }

  getMonthYear(): string {
    const options = { month: 'long', year: 'numeric' } as const;
    return this.currentMonth.toLocaleDateString(undefined, options);
  }

  addEvent(date: Date) {
    const dateString = date.toDateString();
    const dialogRef = this.dialog.open(AddCalenderComponent, {
      width: '500px',
      data: { date: date }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!this.events[dateString]) {
          this.events[dateString] = [];
        }
        if (this.isOverlapping(dateString, result)) {
          alert('Event overlaps with another event.');
        } else {
          this.events[dateString].push(result);
        }
      }
    });
  }

  removeEvent(date: Date, eventToRemove: Event) {
    const dateString = date.toDateString();
    if (this.events[dateString]) {
      this.events[dateString] = this.events[dateString].filter(event => event.id !== eventToRemove.id);
      if (this.events[dateString].length === 0) {
        delete this.events[dateString];
      }
    }
  }



  getEventHeight(startTime: string, endTime: string): string {
    // Calculate height based on start and end time
    const start = parseInt(startTime.split(':')[0], 10);
    const end = parseInt(endTime.split(':')[0], 10);
    return `${(end - start) * 50}px`; // Adjust height per hour (50px per hour)
  }

  onDragStart(event: DragEvent, eventData: any) {
    event.dataTransfer?.setData('text/plain', JSON.stringify(eventData));
    this.draggedEvent = eventData;
  }
  
  onDrop(event: DragEvent, targetDate: Date) {
    event.preventDefault();
  
    if (this.draggedEvent) {
      const sourceDate = this.draggedEvent.date;
      this.removeEvent(sourceDate, this.draggedEvent);
  
      if (!this.events[targetDate.toDateString()]) {
        this.events[targetDate.toDateString()] = [];
      }
      this.events[targetDate.toDateString()].push(this.draggedEvent);
  
      this.draggedEvent = null;
    }

    console.log("all", this.events)
  }
  

  allowDrop(event: DragEvent) {
    event.preventDefault();  // Required to allow dropping
  }

  isOverlapping(dateString: string, newEvent: any): boolean {
    const existingEvents = this.events[dateString] || [];
    for (const event of existingEvents) {
      if (newEvent.startTime < event.endTime && newEvent.endTime > event.startTime) {
        return true;  // Overlapping event found
      }
    }
    return false;  // No overlap
  }


  editEvent(date: Date, eventToEdit: any) {
    const dialogRef = this.dialog.open(AddCalenderComponent, {
      width: '500px',
      data: { event: eventToEdit , date: date }  // Pass the event to edit
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const dateString = date.toDateString();
        const eventIndex = this.events[dateString]?.findIndex(e => e === eventToEdit);
        if (eventIndex !== undefined && eventIndex >= 0) {
          this.events[dateString][eventIndex] = result;
        }
      }
    });
  }

}
