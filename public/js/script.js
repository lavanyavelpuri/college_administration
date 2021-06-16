const slider = document.querySelector('.images-slider')
const imgs = document.querySelectorAll('img')
var i=0;
console.log(imgs.length)
function changeSlide() {
  i++
  if(i > imgs.length - 1) {
    i = 0;
  }
  slider.style.transform = `translateX(${-i * 1110}px)`;
  //setInterval(changeSlide, 1000)
}
setInterval(changeSlide, 1000)