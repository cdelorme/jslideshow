(function(w) {

    /**
     * UI Abstraction
     */

    function Dom() {};
    Dom.prototype.elements = {
        img: 'img'
    };
    // implementation pending


    /**
     * Controls
     */

    function Controls(context) {
        w.addEventListener("keyUp", function(e) {
            e.keyCode && {
                32: context.toggle, // space
                37: context.next, // right
                39: context.prev // left
            }[e.keyCode]();
        }, false);
    };


    /**
     * SlideShow
     */

    // constructor
    function SlideShow(context, options) {
        this.context = context;
        this.images = [];

        // merge options with defaults
        for (var i in this.options) {
            if (typeof options[i] !== "undefined") {
                this.options[i] = options[i];
            }
        }

        // attach controls to UI
        if (this.options.controls) Controls(this.context);

        // begin render loop immediately
        this.render(this);

        // console.log("testing playing");
        // this.play();
    }

    // static-shared preloader cache
    SlideShow.prototype.cached = {};

    // defaults (states & settings)
    SlideShow.prototype.options = {
        playing: false,
        ready: false,
        controls: false,
        delay: 3000,
        transition: 50,
        index: 0,
        elapsed: 0,
        updated: 0
    };

    SlideShow.prototype.ready = function() {
        var state = true;
        for (var i in this.images) {
            if (this.images[i].image === null) state = false;
        }
        return this.options.ready = state;
    };

    SlideShow.prototype.remove = function(o, a) {
        if (o === parseInt(o)) {
            this.images.splice(o, 1);
        } else {
            var i = 0;
            var f = false;
            do {
                if (this.images[i] === o && (f = true)) this.images.splice(i, 1);
                i++;
            } while (i < this.images.length && (!f || a))
        }
        if (this.options.index >= this.images.length) this.options.index = 0;
    };

    SlideShow.prototype.preload = function(ss, images) {
        if (! images instanceof Array) return;
        images.map(function(o) {
            if (typeof ss.cached[o.src] !== 'undefined' || ss.cached[o.src] === null && ss.remove(o)) return;
            ss.cached[o.src] = o;
            var img = document.createElement('img');
            img.addEventListener('error', function(e) {
                e.preventDefault();
                ss.cached[o.src] = null;
                ss.remove(o, true);
                ss.ready();
            });
            img.addEventListener('load', function(e) {
                for (var i in images) {
                    if (images[i].src === o.src) images[i].image = this;
                }
                ss.ready();
            });
            img.src = o.src;
        }, this);
        console.log(ss.images);
    };

    SlideShow.prototype.parse = function(data) {
        s = [];
        if (data instanceof Array) {
            for (var i in data) {
                s = s.concat(this.parse(data[i]));
            }
        } else if (typeof data === 'string') {
            s.push({
                src: data,
                image: null,
                delay: this.options.delay,
                transition: this.options.transition
            });
        } else if (typeof data === 'object') {
            if (typeof data.type !== 'undefined' &&
                typeof data.start !== 'undefined' && data.start === parseInt(data.start) &&
                typeof data.end !== 'undefined' && data.end === parseInt(data.end)) {
                for (var i = data.start; i < data.end; i++) {
                    s.push({
                        image: null,
                        src: (typeof data.prefix === 'undefined' ? '' : data.prefix) + i + (typeof data.type === 'undefined' ? '' : data.type),
                        delay: typeof data.delay === 'undefined' ? this.options.delay : data.delay,
                        transition: typeof data.transition === 'undefined' ? this.options.transition : data.transition
                    });
                }
            } else if (typeof data.image !== 'undefined') {
                s.push({
                    src: data.image,
                    image: null,
                    delay: typeof data.delay === 'undefined' ? this.options.delay : data.delay,
                    transition: typeof data.transition === 'undefined' ? this.options.transition : data.transition
                });
            }
        }
        return s;
    };

    SlideShow.prototype.insert = function(data, idx) {
        var images = this.parse(data);
        this.images.splice.apply(this.images, [idx, 0].concat(images));
        this.preload(this, images);
    };

    SlideShow.prototype.add = function(data) {
        this.insert(data, this.images.length);
    };

    SlideShow.prototype.toggle = function() { this.options.playing = !this.options.playing; };

    SlideShow.prototype.play = function() { this.toggle(); };

    SlideShow.prototype.pause= function() { this.toggle(); };

    SlideShow.prototype.render = function(o) {
        if (
                this.options.playing === true &&
                (this.options.elapsed += Date.now() - this.options.updated) &&
                (this.options.updated = Date.now()) &&
                typeof this.images[this.options.index] !== "undefined" &&
                this.options.elapsed >= this.images[this.options.index].delay) {

            this.next();
            console.log("update context");
        }

        w.requestAnimationFrame(function(e) {
            o.render(o);
        });
    }

    SlideShow.prototype.next = function() {
        this.options.index = this.options.index + 1 >= this.images.length ? 0 : this.options.index + 1;
    };

    SlideShow.prototype.prev = function() {
        this.options.index = this.options.index > 0 ? this.options.index - 1 : this.images.length - 1;
    };


    /**
     * Global Accessibility
     */

    window.slideShow = function(context, options, images) {
        var ss = new SlideShow(context, options);
        ss.add(images);
        return ss;
    };

})(window);