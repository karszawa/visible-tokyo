import * as React from "react";
import {ControlButton, ControlButtonWrapper} from "./App.components";

export default class ControlBox extends React.Component {
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