import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Circle } from 'react-google-maps';
import { MAP_TYPE_RENT, MAP_TYPE_ACCESS } from '../constants';
import RentMap from "./RentMap";
import AccessMap from "./AccessMap";
import InformationPanel from "./InformationPanel";
import ControlBox from "./ControlBox";
import {getDistanceFromLatLonInKm} from "../lib/lib";
import {STATIONS} from "../lib/data";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mapType: MAP_TYPE_ACCESS,
      zoom: 14,
      destination: null,
      origin: null,
      nearLines: []
    };
  }

  componentDidMount() {
  }

  onPlacesChanged(place) {
    this.googleMap.panTo(place);
    this.setState({ destination: place, zoom: 15 });
  }

  onChangeOrigin(place) {
    this.setState({ origin: { lat: place.latLng.lat(), lng: place.latLng.lng() } });
    console.log(place);
    this.updateAccess({ lat: place.latLng.lat(), lng: place.latLng.lng() });
  }

  updateAccess(origin) {
    const lines = STATIONS.filter(station =>
      getDistanceFromLatLonInKm(station.lat, station.lng, origin.lat, origin.lng) <= 0.5
    ).map(station => station.line).filter((x, i, self) =>
      self.indexOf(x) === i
    ).map((line, i) =>
      line
    );

    this.setState({ nearLines: lines });
  }

  onClickControlBox(mapType) {
    console.log(`Switch to ${mapType}`);
    this.setState({ mapType: mapType });
  }

  render() {
    return (
      <GoogleMap
        defaultCenter={{ lat: 35.71215, lng: 139.7626531 }}
        ref={ e => this.googleMap = e }
        zoom={ this.state.zoom }
        onClick={ ::this.onChangeOrigin }
      >
        { this.state.destination && <Marker position={this.state.destination} /> }

        <InformationPanel
          origin={this.state.origin}
          destination={this.state.destination}
          onPlacesChanged={ ::this.onPlacesChanged }
        />

        { this.renderOriginCircle() }

        <ControlBox
          names={[ 'Rent', 'Access' ]}
          keywords={[ MAP_TYPE_RENT, MAP_TYPE_ACCESS ]}
          onClick={ ::this.onClickControlBox }
        />

        { this.renderMap() }
      </GoogleMap>
    );
  }

  renderMap() {
    switch (this.state.mapType) {
      case MAP_TYPE_RENT:   return <RentMap />;
      case MAP_TYPE_ACCESS: return <AccessMap targets={ this.state.nearLines } />;
      default: return null;
    }
  }

  renderOriginCircle() {
    if (!this.state.origin) {
      return null;
    }

    return (
        <Circle
          key={"origin-circle-100"}
          radius={100}
          center={this.state.origin}
            options={{ fillColor: 'red', fillOpacity: 0.3, strokeWeight: 0.5, strokeColor: 'white', strokeOpacity: 0.5 }}
        />,
        <Circle
          key={"origin-circle-20"}
          radius={20}
          center={this.state.origin}
          options={{ fillColor: 'red', fillOpacity: 0.8, strokeWeight: 0 }}
        />
    );
  }
}

const properties = withProps({
  googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDEG16WeMaOoAtxtKMfp0YUEM2S2CTksh0",
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div style={{ height: `100vh` }} />,
  mapElement: <div style={{ height: `100%` }} />,
});

export default compose(properties, withScriptjs, withGoogleMap)(props => <App />);
