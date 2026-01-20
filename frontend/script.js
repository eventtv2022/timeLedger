
async function loadBookings() {
  const res = await fetch('/api/minutes');
  const data = await res.json();
  console.log('Loaded bookings:', data);
}

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const minute = document.getElementById('minuteInput').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  const res = await fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ minute, name, email, phone }),
  });

  const data = await res.json();
  const msgDiv = document.getElementById('message');
  msgDiv.textContent = data.error
    ? 'Ошибка: ' + data.error
    : 'Минуту успешно забронировано!';
});

loadBookings();
