//Deal countdown
function countDown() {
  document
    .querySelectorAll(".product-deal-count, .deal-count")
    .forEach(function (element) {
      var endTime = new Date(element.getAttribute("data-end-date"));
      endTime = Date.parse(endTime) / 1000;

      var now = new Date();
      now = Date.parse(now) / 1000;

      var timeLeft = endTime - now;

      if (timeLeft > 0) {
        var days = Math.floor(timeLeft / 86400);
        var hours = Math.floor((timeLeft - days * 86400) / 3600);
        var minutes = Math.floor((timeLeft - days * 86400 - hours * 3600) / 60);
        var seconds = Math.floor(
          timeLeft - days * 86400 - hours * 3600 - minutes * 60
        );

        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }

        element.querySelector(".days").innerHTML = days + "<span>Days</span>";
        element.querySelector(".hours").innerHTML =
          hours + "<span>Hours</span>";
        element.querySelector(".minutes").innerHTML =
          minutes + "<span>Minutes</span>";
        element.querySelector(".seconds").innerHTML =
          seconds + "<span>Seconds</span>";
      } else {
        element.querySelector(".deal-clock").style.display = "none";
        element.querySelector(".deal-ended").innerHTML = "Offer expired";
      }
    });
}
setInterval(function () {
  countDown();
}, 1000);
