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
  hours: string[] = [];
  constructor(public dialog: MatDialog) {}
  eventsForDay: { [key: string]: any[] } = {};  // Events organized by hour


  ngOnInit() {
    this.updateCalendar();
  }


  setupDailyView() {
    this.hours = Array.from({ length: 24 }, (_, i) => `${i}:00 - ${i + 1}:00`);
    this.eventsForDay = {};
    // Populate eventsForDay with events filtered for the current day
    const dateString = this.currentMonth.toDateString();
    const eventsForDate = this.events[dateString] || [];
    eventsForDate.forEach(event => {
      const startHour = new Date(event.startTime).getHours();
      const endHour = new Date(event.endTime).getHours();
      for (let hour = startHour; hour <= endHour; hour++) {
        const hourKey = `${hour}:00 - ${hour + 1}:00`;
        if (!this.eventsForDay[hourKey]) {
          this.eventsForDay[hourKey] = [];
        }
        this.eventsForDay[hourKey].push(event);
      }
    });
  }

  toggleView(isDaily: boolean) {
    this.isDailyView = isDaily;
    this.updateCalendar(); // Update the view based on the toggle
  }
  

  updateCalendar() {
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

  removeEvent(date: Date, eventToRemove: any) {
    const dateString = date.toDateString();
    if (this.events[dateString]) {
      this.events[dateString] = this.events[dateString].filter(event => event !== eventToRemove);
      if (this.events[dateString].length === 0) {
        delete this.events[dateString];
      }
    }
  }


  onDragStart(event: DragEvent, date: Date, eventData: any) {
    event.dataTransfer?.setData('text/plain', JSON.stringify(eventData));
    this.draggedEvent = eventData;
    this.draggedFromDate = date;
  }


  onDrop(event: DragEvent, date: Date) {
    event.preventDefault();

    if (this.draggedEvent && this.draggedFromDate) {
      const draggedDateString = this.draggedFromDate.toDateString();
      const targetDateString = date.toDateString();

      // Remove event from the original date
      this.events[draggedDateString] = this.events[draggedDateString].filter(e => e !== this.draggedEvent);
      if (this.events[draggedDateString].length === 0) {
        delete this.events[draggedDateString];
      }

      // Add event to the new date
      if (!this.events[targetDateString]) {
        this.events[targetDateString] = [];
      }
      this.events[targetDateString].push(this.draggedEvent);

      this.draggedEvent = null;
      this.draggedFromDate = null;
    }
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
}
