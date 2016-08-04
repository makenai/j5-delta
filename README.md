# J5-Delta

### Delta Robot Component for Johnny-Five

![Delta Robots](https://raw.githubusercontent.com/makenai/j5-delta/master/assets/3deltas.png)

## Usage

```javascript
var five = require("johnny-five");
var Deltabot = require('j5-delta');
var board = new five.Board();

board.on("ready", function() {
  var delta = new Deltabot({
    pins: [ 9, 10, 11 ],
    type: 'tapster'
  });

  delta.moveTo([20, -20, -150]);
  // other commands
});
```

## Constructor Parameters

| Property | Type | Value/Description | Default | Required |
| --- | --- | --- | --- | --- |
| pins | Array | An array of three pins id's with servos attached |  | yes |
| startAt | Number | Any number between 0-180. Degrees to initialize the servos at. | 5 | no |
| tapDepth | Number | The depth at which to plunge the end effector for a tap or draw. | -160 | no |
| servoSpeed | Number | Number of seconds it takes your servo to move 60 degrees, used to calculate movement time | 0.40 | no |
| dimensions | Object | Collection of dimensions describing the geometry of the delta robot you want to control. | | no |
| type | String | The name of a known delta robot configuration. If you don't specify this, you should specify *dimensions*. Valid values: 'tapster', 'junky'

## Dimensions

![Delta Dimensions](https://raw.githubusercontent.com/makenai/j5-delta/master/assets/geometry.png)

| Variable | Description |
| --- | --- | --- |
| f | base length | 
| e | end effector length |
| rf | bicep length |
| re | forearm length |

If you have a custom delta robot you will need to make a few measurements of the geometry and pass it in. Normally, these measurements should be in millimeters. If your design is open source or commonly available, please consider sending a pull request to add it as a named configuration to `configurations.js`!

Example initializing with custom dimensions:

```javascript
var delta = new Deltabot({
	pins: [ 9, 10, 11 ],
	dimensions: {
		f: 163,
		e: 80.25,
		rf: 128.75,
		re: 155
    }
});
```


## API

### home()

Move all of the servos to their home position as specififed by `startAt` at Deltabot initialization.

```javascript
deltabot.home();
```

### moveTo(coords, [callback])

Move the end effector to the specified X, Y and Z coordinates. Callback is triggered when the movement is done.

```javascript
deltabot.moveTo([20, -20, -140]);
```

**Note on coordinate system:** The coordinate system origin (0,0,0) starts a point directly centered between the three motor axes. Therefore, the Z coordinate of the end effector will always be below that and negative.


### getPosition([angles])

Get the current position of the end effector through a forward kinematic calculation. If you do not specify the angles, it will use the last known servo angles.

Note: The position returned by `getPosition()` will most likely differ from what you passed in to `moveTo()`. This is due to the limited range of motion on a hobby servo. The position returned by `getPosition()` is closer to the true position.

```javascript
deltabot.moveTo([20, -20, -140]);
deltabot.getPosition(); // [ 0, 19.61168100866987, -20.1826220029087, -140.14643590955427 ]
```

### getServoAngles()

Get the current positions of each of the three servo motors in degrees.

```javascript
deltabot.moveTo([45, -32, -150]);
deltabot.getServoAngles(); // [ 22, 17, 56 ]
```

### tap(x, y, [callback])

Tap at the specified X and Y coordinates, plunging to a depth specified by the *tapDepth* option.

```javascript
deltabot.tap(40, 75);
```

### draw(coords, [callback])

Draw by dragging the end effector at *tapDepth* between all of the X,Y coordinates in the coords paramter.

```javascript
// Draw a 40mm box starting at position 10,10
deltabot.draw([
  [10,10],
  [50,10],
  [50,50],
  [50,10],
  [10,10]
]);
```
