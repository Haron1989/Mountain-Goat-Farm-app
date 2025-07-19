// Farm Calendar Dashboard JS
let calendar;
let events = [];

window.addEventListener('DOMContentLoaded', () => {
  calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    initialView: 'dayGridMonth',
    events: events,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    }
  });
  calendar.render();

  document.getElementById('calendar-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('form-title').value.trim();
    const date = document.getElementById('form-date').value;
    const type = document.getElementById('form-type').value;
    const event = { title: `${type}: ${title}`, start: date };
    events.push(event);
    calendar.addEvent(event);
    document.getElementById('calendar-form-status').textContent = 'Event added!';
    document.getElementById('calendar-form').reset();
  });
});
