document.getElementById("open").addEventListener("click", function () {
  var container = document.getElementById("openContainer");
  var halo = document.getElementById("halo");

  // Memicu animasi tirai dan menghilangkan container
  container.classList.add("slide-up");
  container.addEventListener("animationend", function () {
    container.remove();
    // Setelah container hilang, tampilkan elemen "Halooo"
    halo.style.display = "block";
  });
});

function initMap() {
  var location = { lat: -34.397, lng: 150.644 };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: location,
  });
  var marker = new google.maps.Marker({
    position: location,
    map: map,
  });
}

var countDownDate = new Date("Dec 25, 2024 10:00:00").getTime();
var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerHTML =
    days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "EXPIRED";
  }
}, 1000);

// counting date
var countDownDate = new Date("Aug 30, 2024 15:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function () {
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes, and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Output the result in an element with id="countdown"
  document.getElementById("countdown").innerHTML =
    days +
    " Days " +
    hours +
    " Hours " +
    minutes +
    " Minutes " +
    seconds +
    " Seconds ";

  // If the count down is over, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "The Wedding has begun!";
  }
}, 1000);
