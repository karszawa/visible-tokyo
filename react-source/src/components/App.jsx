import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Circle, InfoWindow } from 'react-google-maps';
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox';
import GoogleMapLoader from 'react-google-maps-loader';
import { Input } from 'react-materialize';
import { SearchInput, ControlButtonWrapper, ControlButton, SelectBoxWrapper, SelectBoxColumn } from './App.components';
import { MAP_TYPE_RENT, MAP_TYPE_ACCESS } from '../constants';

const GeoJSON = require('json-loader!../../data/tokyo.geojson');
const Suumo = JSON.parse(require('json-loader!../../data/suumo.json'));
const Stations = require('json-loader!../../data/all_stations.json');

function sum(arr, fn) {
  if (fn) {
    return sum(arr.map(fn));
  }

  return arr.reduce(function(prev, current, i, arr) {
    return prev + current;
  }, 0);
};

function average(arr, fn) {
  return sum(arr, fn) / arr.length;
};

class CustomSearchBox extends React.Component {
  onPlacesChanged() {
    const places = this.searchBox.getPlaces();

    if (!places[0]) {
      return null;
    }

    this.props.onPlacesChanged({
      lat: places[0].geometry.location.lat(),
      lng: places[0].geometry.location.lng()
    });
  }

  render() {
    return (
      <SearchBox
        ref={ e => this.searchBox = e }
        controlPosition={ google.maps.ControlPosition.TOP_LEFT }
        onPlacesChanged={ ::this.onPlacesChanged }
      >
        <SearchInput
          type="text"
          placeholder="Search your destination"
        />
      </SearchBox>
    );
  }
}

class ControlBox extends React.Component {
  render() {
    const buttons = this.props.keywords.map((keyword, i) => {
      return (
        <ControlButton
          key={ keyword }
          onClick={ this.props.onClick.bind(this, keyword) }
        >
          { this.props.names[i] }
        </ControlButton>
      );
    });

    return (
      <ControlButtonWrapper>
        { buttons }
      </ControlButtonWrapper>
    );
  }
}

class SelectBox extends React.Component {
  constructor(props, state) {
    super(props);

    console.log("SelectBox Contructor");
    this.state = {
      checked: [ 15, 20, 'JR山手線' ]
    };
  }

  onChange(keyword) {
    let checked = [];

    if (this.state.checked.some(v => v == keyword)) {
      checked = this.state.checked;
      this.state.checked.some((v, i) => { if (v == keyword) checked.splice(i, 1); });
      this.setState({ checked: checked });
    } else {
      checked = this.state.checked.concat(keyword);
      this.setState({ checked: checked });
    }

    this.props.onSelect(checked);
  }

  render() {
    const columns = this.props.keywords.map((keyword, i) => {
      return (
        <SelectBoxColumn key={ keyword }>
          <input
            type="checkbox"
            id={`${keyword}`}
            onChange={ this.onChange.bind(this, keyword) }
            checked={ this.state.checked.some(v => v == keyword) }
          />
          <label htmlFor={`${keyword}`}>{ this.props.names[i] }</label>
        </SelectBoxColumn>
      );
    });

    return (
      <SelectBoxWrapper>
        { columns }
      </SelectBoxWrapper>
    );
  }
}

const AccessSelectBox = (props) => {
  const lines = [
    'JR山手線', 'JR中央線(快速)', 'JR中央・総武線', '東京メトロ銀座線',
    '東京メトロ丸ノ内線', '東京メトロ日比谷線', '東京メトロ東西線',
    '東京メトロ千代田線', '東京メトロ有楽町線', '東京メトロ半蔵門線',
    '東京メトロ南北線', '東京メトロ副都心線', '都営大江戸線',
    '都営浅草線', '都営三田線', '都営新宿線', '京王井の頭線'
  ];

  return (
    <SelectBox
      names={ lines }
      keywords={ lines }
      onSelect={ props.onSelect }
    />
  );
};

const RentSelectBox = (props) => {
  const numbers = Array.apply(null, { length: 8 }).map(Number.call, Number);

  return (
    <SelectBox
      names={ numbers.map(i => `${10+5*(i+1)}~${10+5*(i+2)}㎡`) }
      keywords={ numbers.map(i => 10 + 5 * (i + 1)) }
      onSelect={ props.onSelect }
    />
  );
};

let renderedStations = {};

class AccessMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      targets: [ 'JR山手線' ]
    }
  }

  renderStations() {
    if (renderedStations[this.state.targets]) {
      return renderedStations[this.state.targets];
    }

    renderedStations[this.state.targets] = Stations.map((station) => {
      if (!this.state.targets.some(target => target === station.line)) {
        return;
      }

      return [
        this.renderCircle(station, 600),
        this.renderCircle(station, 300),
        this.renderCircle(station, 100),
      ];
    });

    return renderedStations[this.state.targets];
  }

  renderCircle(station, radius) {
    return (
      <Circle
        key={ station.name + radius }
        radius={ radius }
        center={{ lat: station.lat, lng: station.lng }}
        options={{
          fillColor: `rgb(${255 - radius / 6}, 0, 0)`,
          opacity: .35,
          strokeColor: 'white',
          strokeWeight: .5
        }}
      />
    );
  }

  render() {
    return [
      this.renderStations(),
      <AccessSelectBox
        key="access-select-box"
        onSelect={ targets => this.setState({ targets: targets }) }
      />
    ];
  }
}

let renderedPolygons = {};

class RentMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      targets: [ 15, 20 ],
      target: null
    };
  }

  render() {
    console.log(this.state);

    const infoWindow = ( this.state.target &&
      <InfoWindow
        key={this.state.target.key}
        position={ this.state.target.position }
        onCloseClick={ () => this.setState({ target: null }) }
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span>{ this.state.target.location }</span>
          <span>{ Math.floor(this.state.target.rent * 10) / 10 }万円</span>
        </div>
      </InfoWindow>
    );

    return [
      this.renderPolygons(),
      infoWindow,
      <RentSelectBox
        selected={ this.state.targets }
        key="rent-select-box"
        onSelect={ targets => this.setState({ targets: targets }) }
      />
    ];
  }

  renderPolygons() {
    console.log('Try to render polygons.');
    if (renderedPolygons[this.state.targets]) {
      console.log('Use memo.');
      return renderedPolygons[this.state.targets];
    }
    console.log('Render polygons.');

    renderedPolygons[this.state.targets] = GeoJSON.features.map((feature, i) => {
      const paths = feature.geometry.coordinates[0].map(ary => { return { lat: ary[1], lng: ary[0] } });
      const avg = this.getPriceFromFeature(feature);
      const color = (avg - 5) * 25;
      const target = {
        key: feature.properties.H27KA13_ID,
        position: { lat: feature.properties.Y_CODE, lng: feature.properties.X_CODE },
        location: this.getLocationFromFeature(feature),
        rent: avg
      };

      return (
        <Polygon
          key={ feature.properties.H27KA13_ID }
          paths={ paths }
          onClick={ () => this.setState({ target: target }) }
          options={{
              strokeColor: '#000000',
              strokeOpacity: 0,
              strokeWeight: 0,
            fillColor: `rgb(${color}, 0, 0)`,
            fillOpacity: isNaN(avg) ? 0 : 0.35
          }}
        />
      );
    });

    return renderedPolygons[this.state.targets];
  }

  getLocationFromFeature(feature) {
    return [
      feature.properties.KEN_NAME,
      feature.properties.GST_NAME,
      feature.properties.MOJI
    ].join('').replace(/丁目$/, '');
  }

  getPriceFromFeature(feature) {
    const place = this.getLocationFromFeature(feature);
    const filtered = (Suumo[place] || []).filter(obj =>
      this.state.targets.some(lowerBound => lowerBound <= obj.area && obj.area <= lowerBound + 5)
    );

    return average(filtered.map(obj => obj.rent));
  }
}

class AltitudeMap extends React.Component {
  render() {
    return null;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mapType: MAP_TYPE_RENT,
      destination: null,
      zoom: 11
    };
  }

  componentDidMount() {
  }

  onPlacesChanged(place) {
    this.googleMap.panTo(place);
    this.setState({ destination: place, zoom: 15 });
  }

  onClickControlBox(mapType) {
    console.log(`Switch to ${mapType}`);
    this.setState({ mapType: mapType });
  }

  render() {
    return (
      <GoogleMap
        defaultZoom={11}
        defaultCenter={{ lat: 35.71215, lng: 139.7626531 }}
        ref={ e => this.googleMap = e }
        zoom={ this.state.zoom }
      >
        <CustomSearchBox
          onPlacesChanged={ ::this.onPlacesChanged }
        />

        { this.state.destination && <Marker position={this.state.destination} /> }

        <ControlBox
          names={[ 'Rent', 'Access', 'Altitude', 'Temp' ]}
          keywords={[ MAP_TYPE_RENT, MAP_TYPE_ACCESS, 'altitude', 'temp' ]}
          onClick={ ::this.onClickControlBox }
        />

        { this.renderMap() }
      </GoogleMap>
    );
  }

  renderMap() {
    switch (this.state.mapType) {
      case MAP_TYPE_RENT:   return <RentMap />;
      case MAP_TYPE_ACCESS: return <AccessMap />;
      default: return <AltitudeMap />;
    }
  }
}

const properties = withProps({
  googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDEG16WeMaOoAtxtKMfp0YUEM2S2CTksh0",
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div style={{ height: `400px` }} />,
  mapElement: <div style={{ height: `100%` }} />,
});

export default compose(properties, withScriptjs, withGoogleMap)(props => <App />);
