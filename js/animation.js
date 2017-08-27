// IT IS REQUIRED THAT THE CONTEXT OBJECT IS CALLED 'ctx'!
//
// This script defines function 'animation( obj, option )', which takes an object
// 'obj' and equipes it with two methods for animating:
// 1) obj.sprite.render( x,y ) draws the current frame on positition (x,y).
// 2) obj.sprite.update() advances the animation one game tick.
// Function 'animation' takes options in the form of the object 'option', which
// should contain the following key-value pairs:
// - option.images, which should contain a list of image objects.
// - option.speed, which should contain a list of integers, signifying the nr of
// 	game ticks between each frame for every sprite resp.
// - option.stdSpriteIndex, which should contain an integer, signifying
// 	the default sprite number.

// example:
//---------------------------------------------------------------------------
// Enable animation of images 'spriteSheet1' and 'spriteSheet2' for object 'stickman'
// with 'spriteSheet1' as default animation:
// var stickman = {};
// var options = {
//   images:[spriteSheet1, spriteSheet2],
//   speed:[25,25],
//   stdSpriteIndex:0
// };
// stickman = animation(stickman, options);

// The setInterval() method calls a function or evaluates an expression
// at specified intervals (in milliseconds).
// Implement frame rate by advancing one game tick every 1/FPS^th second:
// setInterval(function() {
//   stickman.sprite.update();
//   stickman.sprite.render(0, 0);
// }, 1000/FPS);

// Switch to animating 'spriteSheet2':
// stickman.sprite.changeAnim(1);
//---------------------------------------------------------------------------
  
function animation( obj, option ) {
  
  obj.sprite = {};
  obj.sprite.images = option.images;
  obj.sprite.index = option.stdSpriteIndex;
  obj.sprite.frameNumber = 0;       // counter frame nr during animation
  obj.sprite.counter = 0;           // counts game ticks per anim frame
  // setting up variables:
  for ( i=0; i<obj.sprite.images.length; i++ ){
	  obj.sprite.images[i].tickPerFrame = option.speed[i] || 0;
	  // calc the width of the sprite on the screen:
	  obj.sprite.images[i].spritewidth = obj.sprite.images[i].width/obj.sprite.images[i].frames;
  }
  // method that draws the current frame on positition (x,y):
  obj.sprite.render = function (x, y){
    
    ctx.drawImage(
      obj.sprite.images[obj.sprite.index],
      obj.sprite.frameNumber * obj.sprite.images[obj.sprite.index].spritewidth,
      0,
      obj.sprite.images[obj.sprite.index].spritewidth,
      obj.sprite.images[obj.sprite.index].height,
      x - obj.sprite.images[obj.sprite.index].spritewidth/2,
      y - obj.sprite.images[obj.sprite.index].height/2,
      obj.sprite.images[obj.sprite.index].spritewidth,
      obj.sprite.images[obj.sprite.index].height);
  };
  
  // method that advances the animation one game tick:
  obj.sprite.update = function (){
    obj.sprite.counter++;           // increment game tick counter

    // if current frame has been on long enough:
    if (obj.sprite.counter > obj.sprite.images[obj.sprite.index].tickPerFrame) {
      obj.sprite.counter = 0;       // reset game tick counter
      // if animation has not ended:
      if (obj.sprite.frameNumber < obj.sprite.images[obj.sprite.index].frames - 1) {
        obj.sprite.frameNumber++;   // go to next frame
      } else {                      // if the animation has ended
        obj.sprite.frameNumber = 0; // start from the first frame
      }
    }
  };
  
  obj.sprite.changeAnim = function ( spriteIndex ){
    if ( spriteIndex < obj.sprite.images.length && spriteIndex != obj.sprite.index ) {
      obj.sprite.index = spriteIndex;
      obj.sprite.frameNumber = 0;   // counter frame nr during animation
      obj.sprite.counter = 0;       // counts game ticks per anim frame
    } else if ( spriteIndex >= obj.sprite.images.length ){
      console.log('Input "spriteIndex" exceeds obj.images.length-1.')
      return 1;
    }
  };
  
  return obj;
};
