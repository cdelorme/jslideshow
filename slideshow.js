(function(window){


    /*===== Namespace Shared Global =====*/

    var controller;


    /*===== SlideShow Constructor =====*/

    var slideShow = function(context, config) {
        this.setContext(context);
        this.setConfig(config);
    };


    /*===== SlideShow Prototype Properties (Defaults) =====*/

    slideShow.prototype.delay = 3000;
    slideShow.prototype.transition = 300;


    /*===== SlideShow Prototype Methods =====*/

    slideShow.prototype.setContext = function(context) {

        // remove from existing context
        if (this.context && this.image) {
            this.context.removeChild(this.image);
        }

        // append to new context
        if (context) {
            this.context = context;
            this.context.appendChild(this.getImage());
        }
    };

    slideShow.prototype.getImage = function() {

        // Create image if not yet exists
        if (!this.image) {
            this.image = new Image();

            // Set CSS3 fade effect on image
            this.setImageTransition();
        }

        return this.image;
    };

    slideShow.prototype.setImageTransition = function() {
        this.image.style['-webkit-transition'] = "opacity " + (this.transition / 1000) + "s linear";
    };

    slideShow.prototype.setConfig = function(config) {

        // Loop through all configuration values (or do nothing if null/empty)
        for (key in config) {

            // Create an index to check for matching method and apply value
            var method = "set" + key.charAt(0).toUpperCase() + key.slice(1);
            if (this[method]) {
                this[method](config[key]);
            }
        }
    };

    slideShow.prototype.setTransition = function(value) {
        this.transition = value;
        this.setImageTransition();
    };

    slideShow.prototype.setDelay = function(delay) {
        // Apply delay if valid and > 2xtransition (fade out & in)
        if (delay && delay > (2 * this.transition)) {
            this.delay = delay;
        }
    };

    slideShow.prototype.getDelay = function() {

        // Acquire current image if exists
        var slide = this.getCurrentSlide();

        // Return the images delay, or the default
        return slide && slide.delay ? slide.delay : this.delay;
    };

    slideShow.prototype.setControls = function(yes) {

        if (yes) {
            // Check for existing controller & remove events
            if (controller) {
                window.removeEventListener(controller, this.keyboard);
                window.removeEventListener(controller, this.mouse);
            }

            // Assign global window keyboard controls to this object
            window.addEventListener('keyup', this.keyboard.bind(this));

            // Mouse Controls
            window.addEventListener('click', this.mouse.bind(this));

            // Set new prototype controller
            controller = this;
        }

    };

    slideShow.prototype.keyboard = function(e) {
        if (e.keyCode) {
            if (e.keyCode == 32) {

                // pause or resume with toggle
                this.toggle();

            } else if (e.keyCode == 37) {

                // Go back (left arrow)
                this.backward();
            } else if (e.keyCode == 39) {

                // Go forward (right arrow)
                this.forward();
            }
        }
    };

    slideShow.prototype.mouse = function() {
        this.forward();
    };

    slideShow.prototype.setImages = function(images) {

        /** Filter supplied images
         *
         *  Supported Formats include raw paths:
         *
         *      [
         *          'source.jpg',
         *          'source.jpg'
         *      ]
         *
         *  Or with custom delays:
         *
         *      [
         *          {
         *              image: 'source.jpg',
         *              delay: 3000
         *          }
         *      ]
         *
         *  Or complete ranges:
         *
         *      [
         *          {
         *              start: #,
         *              end: #,
         *              prefix: 'pre-',
         *              type: '.jpg',
         *              delay: 3000
         *          }
         *      ]
         *
         */

        // Prepare slides
        delete(this.slides);
        this.slides = [];

        // Prepare Preloader Images
        delete(this.images);
        this.images = {};

        // Loop all supplied values, or do nothing
        for (index in images) {

            // Grab the record
            var row = images[index];

            // Check for objects or string
            if (typeof(row) === "object") {

                if (row.image) {

                    // Create a record
                    var slide = {
                        src: row.image
                    };

                    // Add delay if set
                    if (row.delay) {
                        slide.delay = row.delay;
                    }

                    // Add a slide
                    this.slides.push(slide);

                    // Add the source to preloader list
                    if (!this.images[row.image]) {
                        this.images[row.image] = {};
                    }
                } else if (row.start && row.end && row.type) {

                    // Iterate all images in range
                    for (var n = row.start; n <= row.end; n++) {

                        // Assemble source name
                        var image = n;
                        if (row.prefix) {
                            image = row.prefix + image;
                        }
                        image = image + row.type;

                        // Create a record
                        var slide = {
                            src: image
                        };

                        // Add delay if set
                        if (row.delay) {
                            slide.delay = row.delay;
                        }

                        // Add a slide
                        this.slides.push(slide);

                        // Add the source to preloader list
                        if (!this.images[image]) {
                            this.images[image] = {};
                        }
                    }
                }
            } else if (typeof(row) === "string") {

                // Create a record
                var slide = {
                    src: row
                };

                // Add a slide
                this.slides.push(slide);

                // Add the source to preloader list
                if (!this.images[row]) {
                    this.images[row] = {};
                }
            }
        }

        // Keep track of preloading status
        this.loading = this.getImageCount() - 1;

        // run preloader on processed images
        this.preload();
    };

    slideShow.prototype.getImageKeys = function() {
        return Object.keys(this.images);
    };

    slideShow.prototype.getImageCount = function() {

        // Get a count of the images using length of its keys
        return this.getImageKeys().length;
    };

    slideShow.prototype.getCurrentImage = function() {
        var source = this.slides[this.index];
        return this.images[source.src];
    }

    slideShow.prototype.getSlidesCount = function() {
        return this.slides.length;
    }

    slideShow.prototype.getCurrentSlide = function() {
        return this.slides[this.index];
    }

    slideShow.prototype.preload = function() {

        // External reference
        var self = this;

        // For each existing record in this.images preload the source
        for (source in this.images) {

            // Load each image
            var image = new Image();
            image.alt = source;
            image.addEventListener('load', function() {
                self.images[this.alt].height = this.height;
                self.images[this.alt].width = this.width;
                self.images[this.alt].src = this.src;

                // Handle loading status
                if (self.loading) {
                    self.loading--;
                } else {
                    delete(self.loading);

                    // if start was triggered, execute callback
                    if (self.waiting) {
                        delete(self.waiting);
                        self.start();
                    }
                }

                // Remove event listener to free up resources
                if (arguments && arguments.callee) {
                    this.removeEventListener(this, arguments.callee);
                }
            });
            image.src = source;
        }
    };

    slideShow.prototype.start = function() {

        // If we are still loading prepare a callback
        if (this.loading) {
            this.waiting = true;
        } else if (!this.running && this.images) {

            // Set running status
            this.running = true;
            this.forward();
        }
    };

    slideShow.prototype.pause = function() {
        if (this.running) {
            delete(this.running);
            this.clear();
        }
    };

    slideShow.prototype.clear = function() {
        if (this.interval) {
            clearTimeout(this.interval);
            delete(this.interval);
        }
    };

    slideShow.prototype.toggle = function() {
        if (this.running) {
            this.pause();
        } else {
            this.start();
        }
    };

    slideShow.prototype.stop = function() {
        this.pause();
        delete(this.index);
    };

    slideShow.prototype.forward = function() {
        this.clear();

        // If index is not set, or is >= max images, then set to -1
        if (typeof(this.index) === "undefined" || this.index == this.getSlidesCount() - 1) {
            this.index = -1;
        }

        this.index++;
        this.render();
        this.interval = setTimeout(function() {
            if (this.running) {
                this.clear();
                this.forward();
            }
        }.bind(this), this.getDelay());
    };

    slideShow.prototype.backward = function() {
        this.clear();

        // If index is not set or less than 0, then set it to image count - 1
        if (!this.index || this.index < 0) {
            this.index = this.getSlidesCount();
        }

        this.index--;
        this.interval = setTimeout(function() {
            if (this.running) {
                this.forward();
            }
        }.bind(this), this.getDelay());
        this.render();
    };

    slideShow.prototype.render = function() {

        // Get image
        slide = this.getCurrentSlide();

        // begin css3 fadeout
        if (this.transition) {
            this.image.style.opacity = "0";

            // Delay for the transition to complete
            setTimeout(function() {

                // Set the new source & resize
                this.image.src = slide.src;
                this.resizeImage();

                // begin css3 fadein
                this.image.style.opacity = "1";
            }.bind(this), this.transition);
        } else {

            // Set the new source & resize
            this.image.src = slide.src;
            this.resizeImage();
        }
    };

    slideShow.prototype.resizeImage = function() {

        // get window size
        var windowSize = this.getBoundingBox();

        // Get image
        image = this.getCurrentImage();

        // Get Ratios
        var ratio = image.width / image.height;
        var windowRatio = windowSize.width / windowSize.height;

        // if ratio is < windowRatio == 100% height, else 100% width
        if (ratio < windowRatio) {
            this.image.style.height = "100%";
            this.image.style.width = "auto";
        } else {
            this.image.style.width = "100%";
            this.image.style.height = "auto";
        }
    };

    slideShow.prototype.getBoundingBox = function() {
        return { 'width': window.innerWidth, 'height': window.innerHeight };
    };

    // Make factory externally available
    window.ss = function(context, config) {
        return new slideShow(context, config);
    };

})(window);