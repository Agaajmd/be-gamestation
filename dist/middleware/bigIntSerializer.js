"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigIntSerializer = bigIntSerializer;
function bigIntSerializer(_req, res, next) {
    res.json = function (data) {
        const stringified = JSON.stringify(data, (_key, value) => typeof value === 'bigint' ? value.toString() : value);
        this.set('Content-Type', 'application/json');
        return this.send(stringified);
    };
    next();
}
//# sourceMappingURL=bigIntSerializer.js.map