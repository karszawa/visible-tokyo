import * as React from "react";
import {InfoWindow, Polygon} from "react-google-maps";
import {GeoLegend, LegendWrapper} from "./App.components";
import RentSelectBox from "./RentSelectBox";
import {GEO_JSON, Suumo} from "../lib/data";
import {average, heatMapColorforValue} from "../lib/lib";

let renderedPolygons = {};

export default class RentMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            targets: [ 15, 20 ],
            target: null,
            maxRent: 100,
            minRent: 0
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
                    <span>{ isNaN(this.state.target.rent) ? 'データなし' : `${Math.floor(this.state.target.rent * 10) / 10}万円` }</span>
                </div>
            </InfoWindow>
        );

        const legendStrings = [0,1,2,3,4].map(i =>
            <span key={i}>
              { Math.floor(this.state.minRent + (this.state.maxRent - this.state.minRent) * i / 4)}万円
            </span>
        );

        const legend = (
            <LegendWrapper key="legend-wrapper">
                <GeoLegend/>
                <div className="numbers">
                    { legendStrings }
                </div>
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
        const key = this.state.targets.join(',');

        if (renderedPolygons[key]) {
            console.log('Use memo.');
            return renderedPolygons[key];
        }
        console.log('Render polygons.');

        let maxRent = 0;
        let minRent = 100;

        GEO_JSON.features.forEach(feature => {
            const rent = this.getPriceFromFeature(feature);

            if (!isNaN(rent)) {
                maxRent = Math.max(rent, maxRent);
                minRent = Math.min(rent, minRent);
            }
        });

        console.log(`Max rent: ${maxRent}`);
        console.log(`Min rent: ${minRent}`);

        this.setState({ maxRent: maxRent, minRent: minRent });

        renderedPolygons[key] = GEO_JSON.features.map((feature, i) => {
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
                        fillColor: heatMapColorforValue((avg - minRent) / (maxRent - minRent)),
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