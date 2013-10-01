var closeAnimation = Ti.UI.createAnimation({
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
    stickyWidth: 100,       // how far to let the user slide before sticy effect
    enabled: false,         // can the view slide
    maxSlide: 250,
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
    slide.initialLeft = ordinates.x;
    slide.start.set(e.x, e.y);
    if(e.x >= (ordinates.width - slide.touchWidth)){
        // if can slide
        slide.setEnabled(true);
    }
});

$.movableView.addEventListener('touchmove', function(e){
    if(slide.enabled){ 
        var ordinates = $.movableView.getRect(),
            newX = ordinates.x + (e.x - slide.start.x),
            direction = (e.x - slide.start.x) < 0 ? 'left' : 'right';
        if( ((direction === 'left') && !(Math.abs(newX) > slide.maxSlide)) ||
            ((direction === 'right') && !(newX > 0)) ) {
            // allowed to slide
            $.movableView.setLeft(newX);
        }
    }
});

$.movableView.addEventListener('touchend', function(e){
    var direction = (e.x - slide.start.x) < 0 ? 'left' : 'right';
    
    if(slide.enabled){
        if(Math.abs(e.x - slide.start.x) > slide.stickyWidth){
            // sticky-ness logic
            if(direction === 'left'){
                $.movableView.animate(openAnimation, function(){
                    slide.setEnabled(false);
                });
            } else if(direction === 'right') {
                $.movableView.animate(closeAnimation, function(){
                    slide.setEnabled(false);
                });
            }
        } else {
            // return back to edge
            if(direction === 'left'){
                $.movableView.animate(closeAnimation, function(){
                    slide.setEnabled(false);
                });
            } else {
                $.movableView.animate(openAnimation, function(){
                    slide.setEnabled(false);
                });
            }
        }
    }
});