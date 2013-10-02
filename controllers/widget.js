var slideAllowed = true,    // in case the app doesn't need a pullout menu
closeAnimation = Ti.UI.createAnimation({
    left : 0,
    curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
    duration : 150
}), 
openAnimation = Ti.UI.createAnimation({
    left : -250,
    curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
    duration : 150
}),
slide = {
    // maintains the state of slide
    touchWidth: 30,         // how wide is the edge slide start region
    stickyWidth: 70,        // how far to let the user slide before sticy effect
    enabled: false,         // can the view slide
    maxSlide: 250,
    isOpen: false,
    initialLeft: 0,
    start: {                // start position of the slide
        x: 0, y: 0,
        set: function(_x, _y){ this.x = _x; this.y = _y; }
    },
    setEnabled: function(val){
        if(val) this.enabled = true;
        else this.enabled = false;
    },

};

$.movableView.addEventListener('touchstart', function(e){
    var ordinates = $.movableView.getRect();

    if((e.x >= (ordinates.width - slide.touchWidth)) && slideAllowed){ 
        // if can slide
        slide.initialLeft = ordinates.x;
        slide.start.set(e.x, e.y);
        slide.setEnabled(true);
    }
});

$.movableView.addEventListener('touchmove', function(e){
    if(slide.enabled && slideAllowed){
        var ordinates = $.movableView.getRect(),
            diff = e.x - slide.start.x,
            newX = ordinates.x + diff,
            direction = (e.x - slide.start.x) < 0 ? 'left' : 'right';

        if(((direction === 'left') && !(Math.abs(newX) > slide.maxSlide)) ||
          ((direction === 'right') && !(newX > 0)) ) { // allowed to slide
            $.movableView.setLeft(newX);
            
            if(Math.abs( Math.abs(slide.initialLeft) - Math.abs(ordinates.x)) > slide.stickyWidth){
                if(direction === 'left'){
                    $.open();
                } else if(direction === 'right') {
                    $.close();
                }
            }
        }
    }
});

$.movableView.addEventListener('touchend', function(e){
    if(slide.enabled && slideAllowed){
        var direction = (e.x - slide.start.x) < 0 ? 'left' : 'right',
        ordinates = $.movableView.getRect();
        if(!(Math.abs(e.x - slide.start.x) > slide.stickyWidth)){
            // return back to edge
            if(direction === 'left'){
                $.close();
            } else {
                $.open();
            }
        }
    }
});

exports.disablePullOut = function(){
    slideAllowed = false;
}

exports.enablePullOut = function(){
    slideAllowed = true;
}

exports.open = function(){
    var ordinates;
    slide.setEnabled(false);
    $.movableView.animate(openAnimation, function(){
        ordinates = $.movableView.getRect();
        slide.initialLeft = ordinates.x;
        slide.isOpen = true;
    });
}

exports.close = function(){
    var ordinates;
    slide.setEnabled(false);
    $.movableView.animate(closeAnimation, function(){
        ordinates = $.movableView.getRect();
        slide.initialLeft = ordinates.x;
        slide.isOpen = false;
    });
}

