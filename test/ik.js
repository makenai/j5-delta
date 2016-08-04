var IK = require('../lib/ik');
var assert = require('chai').assert;
var fuzzy = require('./helpers/fuzzy')

describe('ik', function() {

  var ik = new IK({
    f: 110.85125168440814,
    e: 34.64101615137754,
    rf: 52.690131903421914,
    re: 153.5
  });

  it('converts coordinates to delta angles', function() {

    fuzzy.assertValuesApproximately(
      ik.inverse(-27.32050807568877, 7.320508075688769, -150),
      [ 0, 22.956287013271716, 29.307413321782146, 4.488122938142878 ],
      'go(-20,20,-150)'
    );

    fuzzy.assertValuesApproximately(
      ik.inverse(-7.320508075688769, -27.32050807568877, -130),
      [ 0, -18.45176477496799, 11.034780911916982, 3.3669288068519405 ],
      'go(20,20,-130)'
    );

    fuzzy.assertValuesApproximately(
      ik.inverse(27.32050807568877, -7.320508075688769, -140),
      [ 0, 5.1201726968427685, -2.219643467178807, 24.174524340026824 ],
      'go(20,-20,-140)'
    );

    fuzzy.assertValuesApproximately(
      ik.inverse(27.32050807568877, -7.320508075688769, -155),
      [ 0, 20.24550559377758, 13.6253744767317, 37.16277870762173 ],
      'go(20,-20,-155)'
    );

    fuzzy.assertValuesApproximately(
      ik.inverse(7.320508075688769, 27.32050807568877, -155),
      [ 0, 37.16277870762173, 13.6253744767317, 20.24550559377758 ],
      'go(-20,-20,-155)'
    );

    fuzzy.assertValuesApproximately(
      ik.inverse(7.320508075688769, 27.32050807568877, -145),
      [ 0, 28.505833897519818, 3.2017655046164593, 10.265473823347941 ],
      'go(-20,-20,-145)'
    );

    fuzzy.assertValuesApproximately(
      ik.inverse(-39.82050807568878, 28.97114317029974, -155),
      [ 0, 43.77831837177831, 39.69904242159183, 4.06610647466908 ],
      'go(-45,20,-155)'
    );

    fuzzy.assertValuesApproximately(
      ik.inverse(39.82050807568878, -28.97114317029974, -155),
      [ 0, 14.765430608123532, 19.55293913151672, 52.129086259403444 ],
      'go(45,-20,-155)'
    );

    fuzzy.assertValuesApproximately(
      ik.inverse(0, 0, -138),
      [ 0, 4.157332977165461, 4.157332977165461, 4.157332977165461 ],
      'go(0,0,-138)'
    );

  });

  it('converts angles to coordinates', function() {

    fuzzy.assertValuesApproximately(
      ik.forward(5, 5, 5),
      [ 0, 0, 0, -138.80679603165254 ],
      'home'
    );

    fuzzy.assertValuesApproximately(
      ik.forward(26.445905100015885, 20.414230081130604, 41.859420606634245),
      [ 0, 25.827953684181605, -6.934053670874096, -161.38254648429827 ],
      '26, 20, 41'
    );

    fuzzy.assertValuesApproximately(
      ik.forward(41.859420606634245, 20.414230081130604, 26.44590510001588),
      [ 0, 6.908910211909088, 25.8346908537062, -161.38254648429827 ],
      '41, 20, 26'
    );

    fuzzy.assertValuesApproximately(
      ik.forward(33.97198200039396, 10.917164126975988, 17.352987263028467),
      [ 0, 7.003460380158584, 26.24038560451879, -152.1650763819104 ],
      '33, 10, 17'
    );

    fuzzy.assertValuesApproximately(
      ik.forward(33.97198200039396, 10.917164126975988, 17.352987263028467),
      [ 0, 7.003460380158584, 26.24038560451879, -152.1650763819104 ],
      '33, 10, 17'
    );

    fuzzy.assertValuesApproximately(
      ik.forward(21.452947889927056, 25.814900100948638, 55.495389711928674),
      [ 0, 37.45704980686204, -27.24355127897814, -161.54202159386105 ],
      '21, 25, 55'
    );

    fuzzy.assertValuesApproximately(
      ik.forward(11.787792268795194, 11.787792268795194, 11.787792268795194),
      [ 0, 0, 0, -145.47988993051865 ],
      '11, 11, 11'
    );

  });

  it('can do a round trip conversion', function() {

    function roundTrip( x, y, z ) {
      var result = ik.inverse(x, y, z);
      fuzzy.assertValuesApproximately(
        [0, x, y, z],
        ik.forward(result[1], result[2], result[3]),
        [x, y, z].join(',')
      );
    }

    roundTrip(-20, 20, -150);

    roundTrip(20, -15, -140);

    roundTrip(22.99038105676658, -9.82050807568877, -140)

    roundTrip(50,-50,-130);

  });

});