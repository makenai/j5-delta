# J5-Delta

### Delta Robot Component for Johnny-Five

![Delta Robots](https://raw.githubusercontent.com/makenai/j5-delta/master/assets/3deltas.png)

## Usage

```javascript
var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var delta = new Deltabot({
    pins: [ 9, 10, 11 ]
  });

  delta.moveTo([20, -20, -150]);
  // other commands
});
```

## Parameters

| Property | Type | Value/Description | Default | Required |
| --- | --- | --- | --- | --- |
| pins | Array | The three pins with a servo attached |  | yes |
| startAt | Number | Any number between 0-180. Degrees to initialize the servos at. | 5 | no |
| virtualRange |Array

## Dimensions

![Delta Dimensions](https://raw.githubusercontent.com/makenai/j5-delta/master/assets/geometry.png)

| Variable | Name | Description |
| --- | --- | --- |
| f | base length |  |
| e | end effector length |  |
| rf | bicep length |  |
| re | forearm length |  |

## API

### home()

Move all of the servos to their home position as specififed by `startAt` at Deltabot initialization.

```javascript
deltabot.home();
```

### moveTo(coords)

Move the end effector to the specified X, Y and Z coordinates.

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

### getServoPositions()

Get the current positions of each of the three servo motors in degrees.

```javascript
deltabot.moveTo([45, -32, -150]);
deltabot.getServoPositions(); // [ 22, 17, 56 ]
```


