
# JS Slideshow

This slideshow plugin is a complete stand-alone module.

It does not have any external dependencies.  It's only requirements are a ECMAScript 5 compliant browser and CSS3 for animations.


## Usage

To create an instance run:

    var mySlideShow = ss(context, config);

_The context is the container you want to attach the image to._

The configuration looks like:

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

You can now add and remove images at runtime:

    mySlideshow.insert(url);
    mySlideshow.insert(url, 2); // insert after second index
    mySlideshow.remove(url); // Remove first instance
    mySlideshow.remove(url, 4); //Remove 4th instance of url

With the reference variable you can set every value in the above config manually:

    mySlideShow.setContext(someDivOrBody);
    mySlideShow.setConfig(config);
    mySlideShow.setImages(imagesObject);
    mySlideShow.setDelay(someNumber);
    mySlideShow.setTransition(someNumber);

_Transition is the time consumed between fading animations.  To turn off animations simply set transition to 0._

If you set control to true, the window will watch for arrow keys, spacebar, and mouse clicks to move forward, backward, and toggle (pause/resume) the slideshow.  **Only one element can be the control element at a time, and the system will automatically revoke previously set slideshows with controls turned on.**

The notify option allows you to get feedback and information.  If you turn on actions you will see a small display informing you that of the command it last processed.  With info turned on every slideshow can/will display a box with the current image source (not tied to control).  _You can stylize the display box by setting config.notify.styles, where objects key->value relationship represent JavaScript style properties and values._  If you intend to turn on info for multiple slideshows on a given page, you may want to adjust the styles for each slideshows display box, or the container you have attached each slideshow to.

A short note on the logic behind the actions and controls.  Actions is used to give you feedback on controls.  Setting notify.actions to true implicitly turns on controls for that slideshow.

Primary control commands:

    s.start();
    s.stop();
    s.pause();
    s.toggle();

Start will begin execution, pause will stop execution but retain the index.  Stop will halt execution and delete the index, resuming at the first image.  Toggle will automatically switch between paused and running (start) states.

You can change any option at anytime.  For example you can switch context, which will simply relocate the slideshow seamlessly.  You can adjust the default delay (_this will not affect images that were supplied a custom delay value_).  You can also turn notifications and controls on and off.

The system is setup to allow as many slideshows as you like to be created per page.  However, only one may have active window controls, and the system will keep track of the last slideshow with activated controls.


## Licensing

This project is licensed under GPLV3.  For details, see the included [license.txt](license.txt) file.
