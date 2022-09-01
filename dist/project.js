// simple range slider

const rangeSlider = document.getElementById("rs-range-line");
const rangeBullet = document.getElementById("rs-present");

if(rangeSlider && rangeBullet) {
    rangeSlider.addEventListener("input", () => {
        rangeBullet.innerHTML = rangeSlider.value + '%';
    });
}


// simple burger menu
const burgerToggler = document.querySelector('.header__burger-open')
const burgerList = document.querySelector('.header__burger-list')

if(burgerToggler && burgerList) {
    burgerToggler.addEventListener("click", (e) => {
        // console.log(e.currentTarget);
        e.currentTarget.classList.toggle('active')
        burgerList.classList.toggle('active')
    });
}

// create by Furizer