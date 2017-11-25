const STATIONS = require('../data/stations.json');
const GeoJSON = require('../data/tokyo.json');
const Suumo = JSON.parse(require('../data/suumo.json'));
const lineData = require('../data/lines.json');

const lineToColorMap = lineData.reduce((hash, obj) => { hash[obj.name] = obj.color; return hash }, {});
const lineToMarkMap = lineData.reduce((hash, obj) => { hash[obj.name] = obj.notation; return hash }, {});

export { STATIONS, GeoJSON, Suumo, lineData, lineToColorMap, lineToMarkMap };
