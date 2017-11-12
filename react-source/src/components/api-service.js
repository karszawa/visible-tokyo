import request from 'superagent';

const API_KEY = 'AIzaSyDEG16WeMaOoAtxtKMfp0YUEM2S2CTksh0';

export default class ApiService {
  async getGeocode(position) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}&key=${API_KEY}`;

    console.log(`GET: ${url}`);

    const ret = await request.get(url);

    return ret.body.results[0].formatted_address;
  }
}
