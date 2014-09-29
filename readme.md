
# jslideshow

A generic image slideshow with basic fading effects, using the newer immediate render mode design approach.


## sales pitch

This plugin aims to provide simple, dependency-free module that can be easily configured and efficiently process images.

What it do:

- preload a list of images retaining order for rendering
- cycles objects with simple application state management
- uses requestAnimationFrame to update displayed contents


## Usage

Grab a container object as the context:

    var context = document.getElementById("context");

Create a configuration file with any of the following formats:

    var config = {
        delay: 4600,
        transition: 300,
        control: true,
        notify: {
            actions: true,
            info: true
        },
        images: [
            'path/src.type',
            {
                image: 'path/src.type',
                delay: 2500,
                transition: 25
            },
            {
                start: 1,
                end: 25,
                type: '.jpg',
                prefix: 'path/img-',
                delay: 7000,
                transition: 0
            }
        ]
    };

You can use these to create an instance with:

    var ss = window.slideShow(context, config);

You can operate the slideshow with these commands:

    ss.play();
    ss.stop();
    ss.toggle();

_If you notice an initial delay when first playing this is normal.  The slideshow will not begin playing until the preloader process has finished._


### configuration details

@TODO


### user controls

A set of default use controls are available, but you can attach your own to the play/stop/toggle methods.

The default controls capture spacebar as toggle, and arrow keys to move forwards and backwards.

Optional info can be displayed in the context area.


## technical details

The code has several stages of operation:

- configuration parsing
- preloading
- execution

The parser will create a standardized set of objects using global and individual options.

The preloader will identify unique image paths, and asynchronously create and load images.  It will keep a tally of these images to delay startup until they are finished.

The execution process becomes incredibly simple by running requestAnimationFrame with a set of standard conditions to decide when to execute and when to make a change.


## requirements

This library requires a [`requestAnimationFrame`](http://caniuse.com/#feat=requestanimationframe) compatible browser.

The code is not compatible with older browsers, or divergent browsers like IE with older event methods.

