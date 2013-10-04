/* slideMenu by Prashanth Padmanabh
 * 
 * Usage:   slideMenu = require('ui/common/slideMenu');
 *          containerView = slideMenu.createSlideMenu();
 *          contentView = slideMenu.getContentView();
 */

var initialized = false, slideAllowed = true,    // in case the app doesn't need a pullout menu
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
    },
    // indentation to represent hierarchy
    containerView = Ti.UI.createView({
        layout: 'composite', 
    }),
        rightMenu = Ti.UI.createView({
                        top: '0dp', right: '0dp',
                        width: '250dp', height: Ti.UI.FILL,
                        zIndex: 997, 
                        layout: 'horizontal',
                        backgroundColor : '#eee'
                    }),
            shadow = Ti.UI.createView({
                        width: '15dp', height: Ti.UI.FILL,
                        backgroundGradient: {
                            type : 'linear',
                            startPoint : {x : '0%', y : '0%'},
                            endPoint : {x : '100%', y : '0%'},
                            colors : [ {color : '#333', offset : 0.0}, 
                                {color : 'rgba(255, 255, 255, 0)', offset : 0.8}]
                        }
                    }), 
            menuView = Ti.UI.createView({height: Ti.UI.FILL, width: Ti.UI.FILL}),
        movableView = Ti.UI.createView({
                        zIndex: 999,
                        layout: 'composite',
                        width : Ti.Platform.displayCaps.platformWidth, 
                        height: Ti.UI.FILL,
                        backgroundColor: 'transparent'
                    }), 
            contentView = Ti.UI.createView({
                width: Ti.Platform.displayCaps.platformWidth,
                height: Ti.UI.FILL,
                zIndex: 998,
            });

function attachEventListeners(){
    if(!initialized){

        movableView.addEventListener('touchstart', function(e){

            var ordinates = movableView.getRect(),
                localPoint = {x:e.x, y:e.y},
                coords = e.source.convertPointToView(localPoint, movableView);

            if((coords.x >= (ordinates.width - slide.touchWidth)) && slideAllowed){ 
                // if can slide
                slide.initialLeft = ordinates.x;
                slide.start.set(coords.x, coords.y);
                slide.setEnabled(true);
            }
        }); 

        movableView.addEventListener('touchmove', function(e){
            var ordinates = movableView.getRect(),
                localPoint = {x:e.x, y:e.y},
                coords = e.source.convertPointToView(localPoint, movableView),
                diff = coords.x - slide.start.x,
                newX = ordinates.x + diff,
                direction = (coords.x - slide.start.x) < 0 ? 'left' : 'right';
            
            if(slide.enabled && slideAllowed && (Math.abs(diff) > 0)){
                if(((direction === 'left') && !(Math.abs(newX) > slide.maxSlide)) ||
                  ((direction === 'right') && !(newX > 0)) ) { // allowed to slide
                    
                    movableView.setLeft(newX);
                    
                    if(Math.abs(Math.abs(slide.initialLeft) - Math.abs(ordinates.x)) > slide.stickyWidth){
                        if(direction === 'left'){
                            exports.open();
                        } else if(direction === 'right') {
                            exports.close();
                        }
                    }
                }
            }
        });

        movableView.addEventListener('touchend', function(e){
            if(slide.enabled && slideAllowed){
                var localPoint = {x:e.x, y:e.y},
                    coords = e.source.convertPointToView(localPoint, movableView),
                    direction = (coords.x - slide.start.x) < 0 ? 'left' : 'right',
                    ordinates = movableView.getRect();
                
                if(!(Math.abs(coords.x - slide.start.x) > slide.stickyWidth)){
                    // return back to edge
                    if(direction === 'left'){
                        exports.close();
                    } else {
                        exports.open();
                    }
                }
            }
        });
    }
};

function init(){
    rightMenu.add(shadow);
    rightMenu.add(menuView);
    movableView.add(contentView);
    
    attachEventListeners();
    
    containerView.add(rightMenu);
    containerView.add(movableView);

    initialized = true;
}

exports.createSlideMenu = function(){

    if(!initialized){
        // Ti.API.info('initialized');
        init();
    } else {
        // Ti.API.info('already initialized');
    }

    return containerView;
}

exports.getContentView = function(){
    return contentView;
}

exports.getMenuView = function(){
    return menuView;
};

exports.disablePullOut = function(){
    slideAllowed = false;
};

exports.enablePullOut = function(){
    slideAllowed = true;
};

exports.open = function(){
    var ordinates;
    slide.setEnabled(false);
    movableView.animate(openAnimation, function(){
        ordinates = movableView.getRect();
        slide.initialLeft = ordinates.x;
        slide.isOpen = true;
    });
};

exports.close = function(){
    var ordinates;
    slide.setEnabled(false);
    movableView.animate(closeAnimation, function(){
        ordinates = movableView.getRect();
        slide.initialLeft = ordinates.x;
        slide.isOpen = false;
    });
};
