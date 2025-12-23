"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Geohash = void 0;
// @ts-ignore
var latlon_geohash_1 = require("latlon-geohash");
exports.Geohash = latlon_geohash_1["default"];
var Geohash = /** @class */ (function () {
    function Geohash() {
        this.description = {
            displayName: 'Geohash',
            name: 'geohash',
            icon: 'fa:map-marker-alt',
            group: ['transform'],
            version: 1,
            description: 'Encode and decode Geohashes using latlon-geohash',
            defaults: {
                name: 'Geohash'
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Encode (Lat/Lon to Hash)',
                            value: 'encode'
                        },
                        {
                            name: 'Decode (Hash to Lat/Lon)',
                            value: 'decode'
                        },
                        {
                            name: 'Get Bounds',
                            value: 'bounds'
                        },
                        {
                            name: 'Get Adjacent',
                            value: 'adjacent'
                        },
                        {
                            name: 'Get Neighbours',
                            value: 'neighbours'
                        },
                    ],
                    "default": 'encode'
                },
                {
                    displayName: 'Latitude',
                    name: 'latitude',
                    type: 'number',
                    "default": 0,
                    displayOptions: {
                        show: {
                            operation: ['encode']
                        }
                    }
                },
                {
                    displayName: 'Longitude',
                    name: 'longitude',
                    type: 'number',
                    "default": 0,
                    displayOptions: {
                        show: {
                            operation: ['encode']
                        }
                    }
                },
                {
                    displayName: 'Precision',
                    name: 'precision',
                    type: 'number',
                    "default": 10,
                    displayOptions: {
                        show: {
                            operation: ['encode']
                        }
                    }
                },
                {
                    displayName: 'Geohash',
                    name: 'geohash',
                    type: 'string',
                    "default": '',
                    displayOptions: {
                        show: {
                            operation: ['decode', 'bounds', 'adjacent', 'neighbours']
                        }
                    }
                },
                {
                    displayName: 'Direction',
                    name: 'direction',
                    type: 'options',
                    options: [
                        { name: 'North', value: 'n' },
                        { name: 'South', value: 's' },
                        { name: 'East', value: 'e' },
                        { name: 'West', value: 'w' },
                    ],
                    "default": 'n',
                    displayOptions: {
                        show: {
                            operation: ['adjacent']
                        }
                    }
                },
            ]
        };
    }
    Geohash.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, returnData, operation, i, result, lat, lon, precision, hash, hash, hash, direction, hash;
            return __generator(this, function (_a) {
                items = this.getInputData();
                returnData = [];
                operation = this.getNodeParameter('operation', 0);
                for (i = 0; i < items.length; i++) {
                    try {
                        result = void 0;
                        if (operation === 'encode') {
                            lat = this.getNodeParameter('latitude', i);
                            lon = this.getNodeParameter('longitude', i);
                            precision = this.getNodeParameter('precision', i);
                            result = {
                                geohash: latlon_geohash_1["default"].encode(lat, lon, precision)
                            };
                        }
                        else if (operation === 'decode') {
                            hash = this.getNodeParameter('geohash', i);
                            result = latlon_geohash_1["default"].decode(hash);
                        }
                        else if (operation === 'bounds') {
                            hash = this.getNodeParameter('geohash', i);
                            result = latlon_geohash_1["default"].bounds(hash);
                        }
                        else if (operation === 'adjacent') {
                            hash = this.getNodeParameter('geohash', i);
                            direction = this.getNodeParameter('direction', i);
                            result = {
                                geohash: latlon_geohash_1["default"].adjacent(hash, direction)
                            };
                        }
                        else if (operation === 'neighbours') {
                            hash = this.getNodeParameter('geohash', i);
                            result = latlon_geohash_1["default"].neighbours(hash);
                        }
                        returnData.push({
                            json: result
                        });
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: {
                                    error: error.message
                                }
                            });
                            continue;
                        }
                        throw error;
                    }
                }
                return [2 /*return*/, [returnData]];
            });
        });
    };
    return Geohash;
}());
exports.Geohash = Geohash;
