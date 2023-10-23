const assert = require('assert');
const jsdom = require('jsdom-global')();
const script = require('../views/static/script');

describe('formatCategory', () => {
    jsdom();
    it('should format "ios engineer" correctly', () => {
        const data = "ios_engineer";
        const result = script.formatCategory(data);
        const expected = "iOS Engineer";
        assert.strictEqual(result, expected);
    });

    it('should format "dba" correctly', () => {
        const data = "dba";
        const result = script.formatCategory(data);
        const expected = "DBA";
        assert.strictEqual(result, expected);
    });

    it('should capitalize other categories correctly', () => {
        const data = "backend_engineer";
        const result = script.formatCategory(data);
        const expected = "Backend Engineer";
        assert.strictEqual(result, expected);
    });
});