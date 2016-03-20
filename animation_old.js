// It is required that the context object is called 'ctx'!
//
// This script defines function 'animation( obj, option )', which takes an object
// 'obj' and equipes it with two methods for animating:
// 1) obj.image.render( x,y ) draws the current frame on positition (x,y).
// 2) obj.image.update() advances the animation one game tick.
// Function 'animation' takes options in the form of the object 'option', which
// should contain the following key-value pairs:
// - ...

// example:
//---------------------------------------------------------------------------
//~ var stickman = {};
//~ var options = { 'image':images.spriteSheet2, 'speed':25 };
//~ stickman = animation(stickman, options);

// "The setInterval() method calls a function or evaluates an expression
// at specified intervals (in milliseconds)."
// implement frame rate by advancing one game tick every 1/FPS^th second:
//~ setInterval(function() {
  //~ stickman.image.update();
  //~ stickman.image.render(0, 0);
//~ }, 1000/FPS);
//---------------------------------------------------------------------------
  
function animation( obj, option ) {
  
  obj.image = option.image;
  // setting up variables:
  obj.image.frameNumber = 0;  // counter frame nr during animation
  obj.image.counter = 0;      // counts game ticks per anim frame
  obj.image.tickPerFrame = option.speed || 0;
  // calc the width of the sprite on the screen:
  obj.image.spritewidth = obj.image.width/obj.image.frames;
  
  // method that draws the current frame on positition (x,y):
  obj.image.render = function (x, y){
    
    ctx.drawImage(
      obj.image,
      obj.image.frameNumber*obj.image.spritewidth,
      0,
      obj.image.spritewidth,
      obj.image.height,
      x,
      y,
      obj.image.spritewidth,
      obj.image.height);
  };
  
  // method that advances the animation one game tick:
  obj.image.update = function (){
    obj.image.counter++; // increment game tick counter

    // if current frame has been on long enough:
    if (obj.image.counter > obj.image.tickPerFrame){  
      obj.image.counter = 0;  // reset game tick counter
      // if animation has not ended:
      if (obj.image.frameNumber < obj.image.frames - 1){
        obj.image.frameNumber++;    // go to next frame
      } else {                      // if the animation has ended
        obj.image.frameNumber = 0;  // start from the first frame
      }
    }
  };

  return obj;
};