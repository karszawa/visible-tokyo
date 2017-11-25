const STATIONS = require('../data/stations.json');
const GEO_JSON = require('../data/tokyo.json');
const Suumo = JSON.parse(require('../data/suumo.json'));
const LINE_DATA = require('../data/lines.json');

const LINE_TO_COLOR_MAP = LINE_DATA.reduce((hash, obj) => { hash[obj.name] = obj.color; return hash }, {});
const LINE_TO_MARK_MAP = LINE_DATA.reduce((hash, obj) => { hash[obj.name] = obj.notation; return hash }, {});

export { STATIONS, GEO_JSON, Suumo, LINE_DATA, LINE_TO_COLOR_MAP, LINE_TO_MARK_MAP };
