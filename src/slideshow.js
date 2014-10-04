(function(w) {

    /**
     * UI Abstraction
     */

    function Dom() {};
    Dom.prototype.elements = {
        img: 'img'
    };
    // still totally incomplete (just started writing)


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
     * Preloader
     */

    function Preloader() {
        this.cache = [];
        this.loaded = [];
    };

    // a (probably) very broken preloader (syntax check & test)
    Preloader.prototype.images = function(slideShow, images) {
        images.map(function(o) {

            // don't preload same image twice
            // @todo change this so we check cache-object for key, and if value is not null we attach to standard object, else we iterate & remove it
            if (typeof this.cache[o.image] !== "undefined") return;
            this.cache.push(o.image);

            // replace this with document.createElement DOM abstraction method
            var img = new Image();

            // catch error events
            img.addEventListener('error', function(e) {
                e.preventDefault();
                // remove image from slideshow.images via SlideShow.remove()
            }.bind(this), false);

            // catch load event
            img.addEventListener('load', function() {

                // may be removing context in favor of reference self, so we can use raw img object

                // merge loaded & cache into object from array
                // append this (where this = img dom object) to image path
                this.loaded.push(o.image);

                // because the preloader is shared via prototype, change this to work with that
                // also we want to (probably) append the actual image dom element to the slideShow images standard objects to simplify rendering a step further
                if (this.loaded.length = slideShow.images.length) {
                    slideShow.options.ready = true;
                }

            }, false).bind(this);
        }, this);
    };


    /**
     * Config Parser
     */

    function Parser() {};
    Parser.prototype.parse = function(data) {
        s = [];
        // return standardized set of items
        if (data instanceof Array) {
            // .map
        } else {
            // single
        }
        return s;
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

        // begin render loop immediately
        this.render();
    }

    // composite utilities
    SlideShow.prototype.parser = new Parser();
    SlideShow.prototype.preloader = new Preloader();

    // defaults
    SlideShow.prototype.options = {

        // states
        playing: false,
        ready: false,

        // settings
        delay: 3000,
        transition: 50,
        index: 0,
        elapsed: 0,
        updated: 0
    };

    // prototype methods
    SlideShow.prototype.add = function(data) {
        this.insert(data, this.images.length);
    };
    SlideShow.prototype.remove = function(o, a) {
        if (o === parseInt(o)) {
            this.images.splice(o, 1);
        } else {
            var i = 0;
            do {
                if (this.images[i] === o) this.images.splice(i, 1);
                i++;
            } while (i < this.images.length && a)
        }
        if (this.options.index >= this.images.length) this.options.index = 0;
    };
    SlideShow.prototype.insert = function(data, idx) {
        var images = this.parser.parse(data);
        this.images.splice(idx, 0, images);
        this.preloader.images(this, images);
    };

    // standard control methods
    SlideShow.prototype.play = function() { this.toggle(); };
    SlideShow.prototype.pause= function() { this.toggle(); };
    SlideShow.prototype.toggle = function() { this.options.playing = !this.options.playing; };

    SlideShow.prototype.render = function(e) {
        if (
                this.options.playing === true &&
                (this.options.elapsed += Date.now() - this.options.updated) &&
                (this.options.updated = Date.now()) &&
                typeof this.images[this.options.index] !== "undefined" &&
                this.options.elapsed >= this.images[this.options.index].delay) {

            this.next();
            // update context
        }

        var self = this;
        w.requestAnimationFrame(function(e) {
            self.render();
        });
    }

    SlideShow.prototype.next = function() {
        this.options.index = this.options.index + 1 >= this.images.length ? 0 : this.options.index + 1;
    };

    SlideShow.prototype.prev = function() {
        this.options.index = this.options.index > 0 ? this.options.index - 1 : this.images.length - 1;
    };

    // globally accessible factory
    window.slideShow = function(context, options, images) {
        var ss = new SlideShow(context, options);
        ss.add(images);
        return ss;
    };

})(window);
