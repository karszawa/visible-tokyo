import styled from 'styled-components';

const SearchInput = styled.input`
  box-sizing: border-box;
  border: 1px solid transparent;
  width: 240px;
  height: 32px;
  margin-top: 10px;
  padding: 0 12px;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  font-size: 14px;
  outline: none;
  text-overflow: ellipses;
`;

const ControlButtonWrapper = styled.div`
  position: absolute;
  top: 52px;
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

  :not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }

  :hover {
    cursor: pointer;
  }
`;

const SelectBoxWrapper = styled.div`
  position: absolute;
  top: 90px;
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
`;

export { SearchInput, ControlButtonWrapper, ControlButton, SelectBoxWrapper, SelectBoxColumn, ShadowBox, LineBadge, LegendWrapper };
