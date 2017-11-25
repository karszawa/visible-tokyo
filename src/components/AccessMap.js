import * as React from "react";
import {lineToColorMap, lineToMarkMap, STATIONS} from "../lib/data";
import {LineBadge, ShadowBox} from "./App.components";
import {Circle, OverlayView} from "react-google-maps";
import {getPixelPositionOffset} from "../lib/lib";
import AccessSelectBox from "./AccessSelectBox";

let renderedStations = {};

export default class AccessMap extends React.Component {
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

        const pointToStations = STATIONS.reduce((hash, station) => {
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

        const overlay = (
            <OverlayView
                key={ `${position.lat},${position.lng}:overlay` }
                position={ position }
                mapPaneName={ OverlayView.OVERLAY_MOUSE_TARGET }
                getPixelPositionOffset={ getPixelPositionOffset }
            >
                <ShadowBox>
                    { stations }
                </ShadowBox>
            </OverlayView>
        );

        return [ overlay, circles ];
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
