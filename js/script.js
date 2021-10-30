window.onload = function () {

    var selectors = { photos: '#gallery .photos img',
                      buttons: {  prev: '#gallery .buttons .prev',
                                  next: '#gallery .buttons .next',
                                  play: '#gallery .buttons .play'
                                }
                    };
    var slider = new Slider(selectors);
}

function Slider(selectors) {
    this.images = document.querySelectorAll(selectors.photos);
    this.btn_prev = document.querySelector(selectors.buttons.prev);
    this.btn_next = document.querySelector(selectors.buttons.next);
    this.btn_play = document.querySelector(selectors.buttons.play);
    this.i = 0;
    var self = this;

    this.prev = function () {
        this.images[this.i].classList.remove('showed');
        this.i--;

        if (this.i < 0) {
            this.i = this.images.length - 1;
        }

        this.images[this.i].classList.add('showed');
    }

    this.next = function () {
        this.images[this.i].classList.remove('showed');
        this.i++;

        if (this.i >= this.images.length) {
            this.i = 0;
        }

        this.images[this.i].classList.add('showed');
    }


    this.btn_prev.onclick = function(){
        self.prev();
    }

    this.btn_next.onclick = function(){
        self.next();
    }

    var autoslider;
    this.btn_play.onclick = function() {
        if (this.value === "play") {
            this.value = "pause";
            autoslider = setInterval(function() { self.next() }, 1000);
        } else {
            this.value = "play";
            clearInterval(autoslider);
        }
    }
}
