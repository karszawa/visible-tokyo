import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Circle, InfoWindow, OverlayView } from 'react-google-maps';
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox';
import { SearchInput, ControlButtonWrapper, ControlButton, SelectBoxWrapper, SelectBoxColumn, LineBadge, ShadowBox, LegendWrapper, InformationContainer, InformationTitle } from './App.components';
import { MAP_TYPE_RENT, MAP_TYPE_ACCESS } from '../constants';
import ApiService from './api-service';

import SuumoLegend from './legend.svg';

const GeoJSON = require('../data/tokyo.geojson');
const Suumo = JSON.parse(require('../data/suumo.json'));
const Stations = require('../data/stations.json');
const lineData = require('../data/lines.json');

const lineToColorMap = lineData.reduce((hash, obj) => { hash[obj.name] = obj.color; return hash }, {});
const lineToMarkMap = lineData.reduce((hash, obj) => { hash[obj.name] = obj.notation; return hash }, {});

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

function heatMapColorforValue(value) {
  const h = (1.0 - value) * 240
  return `hsl(${h}, 100%, 50%)`;
}

function getPixelPositionOffset(width, height) {
  return {
    x: -(width / 2),
    y: -(height / 2)
  };
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

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
        controlPosition={ window.google.maps.ControlPosition.TOP_LEFT }
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

    if (this.state.checked.some(v => v === keyword)) {
      checked = this.state.checked;
      this.state.checked.some((v, i) => v === keyword && checked.splice(i, 1));
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
            checked={ this.state.checked.some(v => v === keyword) }
            style={{ marginRight: '10px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '200px' }}>
            <label htmlFor={`${keyword}`}>{ this.props.names[i] }</label>
            { this.props.notations && <div style={{ backgroundColor: lineToColorMap[keyword], width: '20px', height: '20px', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '11px' }}>{ this.props.notations[i] }</div>}
            </div>
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

class AccessSelectBoxBase extends React.Component {
  constructor(props, state) {
    super(props);

    console.log("SelectBox Contructor");
    this.state = {
      checked: this.props.targets
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.targets !== this.state.checked) {
      this.setState({ checked: nextProps.targets });
    }
  }

  onChange(keyword) {
    let checked = [];

    if (this.state.checked.some(v => v === keyword)) {
      checked = this.state.checked;
      this.state.checked.some((v, i) => v === keyword && checked.splice(i, 1));
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
            checked={ this.state.checked.some(v => v === keyword) }
            style={{ marginRight: '10px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '200px' }}>
            <label htmlFor={`${keyword}`}>{ this.props.names[i] }</label>
            { this.props.notations && <div style={{ backgroundColor: lineToColorMap[keyword], width: '20px', height: '20px', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '11px' }}>{ this.props.notations[i] }</div>}
            </div>
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
  const lines = lineData.map(line => line.name);
  const keywords = lineData.map(line => line.name);
  const notations = lineData.map(line => line.notation);

  return (
    <AccessSelectBoxBase
      names={ lines }
      keywords={ keywords }
      notations={ notations }
      targets={ props.targets }
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
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ targets: nextProps.targets });
  }

  renderStations() {
    if (renderedStations[this.state.targets]) {
      return renderedStations[this.state.targets];
    }

    const pointToStations = Stations.reduce((hash, station) => {
      if (!this.state.targets.some(name => name === station.line)) {
        return hash;
      }

      const lat = station.lat;
      const lng = station.lng;

      hash[`${lat},${lng}`] = (hash[`${lat},${lng}`] || []).concat(station.line);
      return hash;
    }, {});

    renderedStations[this.state.targets] = Object.keys(pointToStations).map(key => {
      const lat = key.split(',')[0];
      const lng = key.split(',')[1];

      return this.renderComposedStations({ lat: lat, lng: lng }, pointToStations[key]);
    });

    return renderedStations[this.state.targets];
  }

  renderComposedStations(position, lines) {
    const stations = lines.map(line => {
      return (
        <LineBadge
          key={`${position.lat}:${position.lng}:${line}`}
          color={lineToColorMap[line]}
        >
          <div>
            { lineToMarkMap[line] || 'S' }
          </div>
        </LineBadge>
      );
    });

    const circles = lines.map(line =>
      <Circle
        key={ `${position.lat}:${position.lng}:${line}:circle` }
        radius={ 300 }
        center={{ lat: Number(position.lat), lng: Number(position.lng) }}
        clickable={false}
        options={{
          fillColor: lineToColorMap[line],
          opacity: .3,
          strokeColor: 'white',
          strokeWeight: .5,
          clickable: false
        }}
      />
    );

    return [
      <OverlayView
        key={`${position.lat},${position.lng}:overlay`}
        position={ position }
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={ getPixelPositionOffset }
      >
        <ShadowBox>
          { stations }
        </ShadowBox>
      </OverlayView>,
      circles
    ];
  }

  render() {
    return [
      this.renderStations(),
      <AccessSelectBox
        key="access-select-box"
        targets={ this.state.targets }
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

    const legend = (
      <LegendWrapper key="legend-wrapper">
        <SuumoLegend width={400} height={100} />
      </LegendWrapper>
    );

    return [
      this.renderPolygons(),
      infoWindow,
      legend,
      <RentSelectBox
        selected={ this.state.targets }
        key="rent-select-box"
        onSelect={ targets => this.setState({ targets: targets, target: null }) }
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
          onClick={ () => target !== this.state.target && this.setState({ target: target }) }
          options={{
              strokeColor: '#000000',
              strokeOpacity: 0,
              strokeWeight: 0,
            fillColor: heatMapColorforValue((avg - 5) / 10), // `rgb(${color}, 0, 0)`,
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

const apiService = new ApiService();

class InformationPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formattedAddress: "",
      duration: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.origin === this.props.origin && nextProps.destination === this.props.destination) {
      return;
    }

    apiService.getGeocode(nextProps.origin).then(result => {
      this.setState({ formattedAddress: result });

      if (!nextProps.destination) {
        return
      }

      var service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [ nextProps.origin ],
        destinations: [ nextProps.destination ],
        travelMode: 'TRANSIT',
        // transitOptions: TransitOptions,
        // drivingOptions: DrivingOptions,
        // unitSystem: UnitSystem,
        // avoidHighways: Boolean,
        // avoidTolls: Boolean,
      }, (response, status) => {
        console.log(response);
        if (response.rows[0].elements[0].duration) {
          this.setState({ duration: response.rows[0].elements[0].duration.text });
        }
      });
    });
  }

  render() {
    console.log(this.state.formattedAddress);

    if (!this.props.origin || !this.props.destination || !this.state.formattedAddress) {
      return null;
    }

    const lines = Stations.filter(station =>
      getDistanceFromLatLonInKm(station.lat, station.lng, this.props.origin.lat, this.props.origin.lng) <= 0.3
    ).map(station => station.line).filter((x, i, self) =>
      self.indexOf(x) === i).map((line, i) =>
      <li key={i}>・{ line }</li>
    );

    return (
      <InformationContainer>
        <InformationTitle>{ this.state.formattedAddress.replace(/.+\d\d\d-\d\d\d\d /, '') }</InformationTitle>
        <div>目的地までの距離: { this.state.duration }</div>
        <div style={{ marginBttom: '20px', marginTop: '20px' }}>300m以内の駅</div>
        <ul>
          { lines || 'なし' }
        </ul>
      </InformationContainer>
    );
  }
}

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
    const lines = Stations.filter(station =>
      getDistanceFromLatLonInKm(station.lat, station.lng, origin.lat, origin.lng) <= 1
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
        <CustomSearchBox
          onPlacesChanged={ ::this.onPlacesChanged }
        />

        { this.state.destination && <Marker position={this.state.destination} /> }
        { this.state.origin &&
          <InformationPanel
            origin={this.state.origin}
            destination={this.state.destination}
          />
        }
        { this.state.origin && [
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
        ]}

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
      case MAP_TYPE_ACCESS: return <AccessMap targets={ this.state.nearLines } />;
      default: return <AltitudeMap />;
    }
  }
}

const properties = withProps({
  googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDEG16WeMaOoAtxtKMfp0YUEM2S2CTksh0",
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div style={{ height: `100vh` }} />,
  mapElement: <div style={{ height: `100%` }} />,
});

export default compose(properties, withScriptjs, withGoogleMap)(props => <App />);
