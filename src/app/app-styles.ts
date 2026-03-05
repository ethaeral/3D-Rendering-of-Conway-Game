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
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

export const RightClip = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Slider = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.25rem;
`;
