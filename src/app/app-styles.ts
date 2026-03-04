import styled from "styled-components";

export const AppContainer = styled.div`
  margin: 0 auto;
  display: flex;
  p {
    font-size: 0.5em;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
`;

export const Controls = styled.div`
  position: absolute;
  top: 40px;
  left: 60px;
  z-index: 50;
  display: flex;
`;

export const RightClip = styled.div``;

export const Buttons = styled.div`
  margin-top: 5px;
  display: flex;
  flex-direction: column;
`;

export const Slider = styled.div`
  padding-top: 20px;
  padding-right: 20px;
`;
