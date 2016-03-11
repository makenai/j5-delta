# J5-Delta
### Delta Robot Control Component for Johnny-Five

## Usage

```javascript
var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var delta = new Deltabot({
    pins: [ 9, 10, 11 ]
  });

  delta.go( 20, -20, -150 );
});
```

## Parameters

| Property | Type | Value/Description | Default | Required |
| --- | --- | --- | --- | --- |
| pins | Array | The three pins with a servo attached |  | yes |
| startAt | number | Any number between 0-180. Degrees to initialize the servos at. | 5 | no |


## API