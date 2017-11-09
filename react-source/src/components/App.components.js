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

export { SearchInput, ControlButtonWrapper, ControlButton };
