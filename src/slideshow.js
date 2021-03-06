(function(w) {

    function SlideShow(context, options) {
        this.context = context;
        this.images = [];
        for (var i in this.options) {
            if (typeof options[i] !== "undefined") this.options[i] = options[i];
        }
        if (this.options.controls) this.controls(this);
        this.render(this);
    }

    SlideShow.prototype.cached = {};

    SlideShow.prototype.options = {
        playing: false,
        ready: false,
        controls: false,
        delay: 3000,
        transition: 0,
        index: 0,
        elapsed: 0,
        updated: 0
    };

    SlideShow.prototype.controls = function(s) {
        w.addEventListener("keyup", function(e) {
            if (!e.keyCode) return;
            if (e.keyCode === 32) { s.toggle(); }
            else if (e.keyCode === 37) { s.prev(); }
            else if (e.keyCode === 39) { s.next(); }
        }, false);
    };

    SlideShow.prototype.ready = function() {
        var state = true;
        for (var i in this.images) {
            if (this.images[i].image === null) state = false;
        }
        return this.options.ready = this.images.length > 0 && state;
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
    };

    SlideShow.prototype.parse = function(data) {
        s = [];
        if (data instanceof Array) {
            for (var i in data) s = s.concat(this.parse(data[i]));
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
                for (var i = data.start; i <= data.end; i++) {
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

    SlideShow.prototype.add = function(data) { this.insert(data, this.images.length); };

    SlideShow.prototype.toggle = function() { this.options.playing = !this.options.playing; };

    SlideShow.prototype.play = function() { this.options.playing = true; };

    SlideShow.prototype.pause = function() { this.options.playing = false; };

    SlideShow.prototype.render = function(s) {
        var d = Date.now();
        if (s.options.ready) {
            var o = s.images[s.options.index];
            var i = o.image;
            var m = s.context.childNodes.length > 0 ? s.context.childNodes[0] : i.cloneNode();
            if (s.options.playing && (s.options.elapsed += (d - s.options.updated)) && s.options.elapsed >= o.delay) s.next();
            if (s.context.childNodes.length === 0) { m.style['-webkit-transition'] = 'opacity ' + (o.transition / 1000) + 's linear'; s.context.appendChild(m); }
            var m = s.context.childNodes[0];
            if (m.src !== i.src) { m.src = i.src; }
            if (i.width / i.height < s.context.clientWidth / s.context.clientHeight) { m.style.height = "100%"; m.style.width = "auto"; }
            else { m.style.width = "100%"; m.style.height = "auto"; }
            if (s.options.elapsed === (d - s.options.updated)) { m.style.opacity = '1'; }
            else if (s.options.playing && m.style.opacity === '' || (m.style.opacity = '1' && s.options.elapsed >= (o.delay - o.transition))) { m.style.opacity = '0'; }
        }
        s.options.updated = d;
        w.requestAnimationFrame(function() { s.render(s); });
    }

    SlideShow.prototype.next = function() {
        this.options.index = this.options.index + 1 >= this.images.length ? 0 : this.options.index + 1;
        this.options.elapsed = 0;
    };

    SlideShow.prototype.prev = function() {
        this.options.index = this.options.index > 0 ? this.options.index - 1 : this.images.length - 1;
        this.options.elapsed = 0;
    };

    w.slideShow = function(context, options, images) {
        var ss = new SlideShow(context, options);
        ss.add(images);
        this.addEventListener("focus", function() { ss.play(); }, false);
        this.addEventListener("blur", function() { ss.pause(); }, false);
        return ss;
    };

})(window);
