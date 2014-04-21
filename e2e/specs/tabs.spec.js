var helpers = require('./helpers');

describe('tabs', function () {
    it('should fail', function () {
        helpers.home()
        var el = element(by.id('tabs'));
        expect(true).toEqual(true);
    });
});