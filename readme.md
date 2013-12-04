
# JS Slideshow

A simple slideshow without any external dependencies.

It does require a modern browser with ECMA Script 5 standards.  Animation requires css3 compatibility.

To use the plugin:

    ss(context, config);

Configuration looks like:

    var config = {
        delay: 4600,
        transition: 300,
        control: true,
        images: [
            'path/src.type',
            {
                image: 'path/src.type',
                delay: 2500
            },
            {
                start: 1,
                end: 25,
                type: '.jpg',
                prefix: 'path/img-',
                delay: 7000
            }
        ]
    };

The context should be obvious (the system will append an img tag to it).

You can store the return of the `ss()` method and use it to control and modify the system at anytime.

For example:

    var s = ss();
    s.setContext(someDivOrBody);
    s.setConfig(config);
    s.setImages(imagesObject);
    s.setDelay(someNumber);
    s.setTransition(someNumber);

_The transition value is the number of milliseconds between animated fadein and fadeout.  You can set it to 0 to disable it._

Other relative commands include:

    s.start();
    s.stop();
    s.pause();
    s.toggle();

The toggle will switch between pause and start, while stop will reset the index, which when start is run again will pick up from the first image.

If control is set to true, the keyboard arrows and space can be used to pause and start.  You can also click to force movement forward.

You can change context at anytime, which will simply remove and append the same image object to the new location.  This transition should be seamless.

Finally, you can have as many slideshows as you want, but only one may have the window controls.  This can be changed at anytime as well, as it keeps track of which slideshows are currently listening.


_A minified copy of the code will take up approximately 4kb._


## Future Features

- Additional optional information panels to display action information and the current image
- Dynamically update delay on all images in a slideshow (as delay can be stored per image)


## Development Notes

Switching active controls has not yet been tested (though the design is in place).
Adding additional display panels should be moderately basic, but options as to which panels to display may need to be implemented.
When images are loaded all slides in the deck are given a delay.  If the delay is equal to the default delay, there would be no way to ensure that such slides are not changed when changing delay.  A resolution should be added to address this (such as not storing delay if not applicable).


