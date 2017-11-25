import styled from 'styled-components';

const SearchInput = styled.input`
  box-sizing: border-box;
  border: 1px solid transparent;
  width: 300px;
  height: 32px;
  margin-top: 10px;
  margin-right: 10px;
  padding: 0 12px;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  font-size: 14px;
  outline: none;
  text-overflow: ellipses;
`;

const ControlButtonWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  background-color: white;
  border-radius: 2px;
  background-clip: padding-box;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  min-width: 44px;
`;

const ControlButton = styled.div`
  text-align: center;
  color: rgb(86, 86, 86);
  font-family: Roboto, Arial, sans-serif;
  font-size: 13px;
  padding: 8px;
  height: 18px;
  display: flex;
  align-items: center;

  :not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }

  :hover {
    cursor: pointer;
  }
`;

const SelectBoxWrapper = styled.div`
  position: absolute;
  top: 52px;
  left: 10px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: white;
  border-radius: 2px;
  background-clip: padding-box;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
`;

const SelectBoxColumn = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 2px;
  border-bottom: 2px solid ${props => props.borderColor || 'rgba(0, 0, 0, 0)' };

  :not(:last-child) {
    margin-bottom: 10px;
  }
`;

const ShadowBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 38px;
  height: 38px;

  background-color: rgba(0, 0, 0, 0.0);
`;

const LineBadge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 13px;
  background-color: ${props => props.color};
  width: 23px;
  height: 23px;
  font-weight: bold;
  border: 1px solid white;
`;

const LegendWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 2px;
  padding: 10px;

  .numbers {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #666;
    margin-top: 10px;
  }
`;

const InformationContainer = styled.div`
  position: absolute;
  top: 50px;
  right: 10px;
  width: 300px;
  padding: 20px;
  background-color: white;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;

  .placeholder {
    color: #DDD;
  }

  .duration-line {
    display: flex;
    width: 120px;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  dl {
    dt {
      margin-bottom: 10px;
      font-size: 13px;
      color: #666;
    }

    dd {
      margin-bottom: 20px;
      font-size: 1rem;
    }
  }
`;

const InformationTitle = styled.div`
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const SelectBoxLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
`;

const SelectBoxLineBadge = styled.div`
  background-color: ${props => props.color};
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 11px;
`;

const GeoLegend = styled.div`
  width: 250px;
  height: 20px;
  background: linear-gradient(to right, hsl(250, 100%, 50%), hsl(200, 100%, 50%), hsl(150, 100%, 50%), hsl(100, 100%, 50%), hsl(50, 100%, 50%), hsl(0, 100%, 50%));
`;

export { SearchInput, ControlButtonWrapper, ControlButton, SelectBoxWrapper, SelectBoxColumn, ShadowBox, LineBadge, LegendWrapper, InformationContainer, InformationTitle, SelectBoxLabel, SelectBoxLineBadge, GeoLegend };
