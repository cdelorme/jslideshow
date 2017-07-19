
# jslideshow

A modern javascript image slideshow with no external dependencies.


## sales pitch

This module aims to deliver a simple dependency free solution for handling image slideshows.

What it offers:

- faded transitions
- asynchronous image preloading
- pauses automatically when window is inactive
- optional built-in controls /w easy to connect control methods for a custom interface

Added benefits:

- less than 200 lines of uncompressed javascript
- uses a modern immediate-rendering approach reducing the amount of code and improving the experience


## Usage

Grab any container object as the context:

    var context = document.getElementById("context");

Supply optional configuration:

    var config = { control: true, delay: 4600, transition: 300 };

Prepare a set of images with a variety of definitions that can use or override default configuration:

    var images = [
        '1.jpg',
        {
            image: '2.gif',
            delay: 7800,
            transition: 0
        },
        {
            prefix: 'path/title-',
            start: 1,
            end: 25,
            type: '.png',
            delay: 2200,
            transition: 50
        },
    ];

Create a slideshow instance:

    var ss = window.slideShow(context, config, images);

You can opt to supply images later, or even add to the existing roll of images:

    var ss = window.slideShow(context, config);
    ss.add(images);

You can also insert them at a specific index:

    ss.insert(12, images);

You can remove by index as well:

    ss.remove(5);

_Any changes to the set of images can be done during runtime, and will immediately be reflected by the slideshow._

You can play, pause, or toggle the slideshows state with:

    ss.play();
    ss.pause();
    ss.toggle();

If controls are set, you can request the next and previous images or toggle the state with arrow keys and spacebar.  Alternatively you can assign your own controls to:

    ss.next();
    ss.prev();

_An initial delay may be evident when preloading large amounts of content.  This is normal, and if you have run `toggle()` or `play()` it will begin playing as soon as the process has finished._


## requirements

The code is not compatible with older browsers.

It depends on standardized `addEventListener` support.

It depends on [`requestAnimationFrame`](http://caniuse.com/#feat=requestanimationframe) compatibility.
