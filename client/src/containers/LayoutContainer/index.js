import * as React from 'react';
// import Container from 'react-bootstrap/Container';

function LayoutContainer({ children }) {
  //     // <Container fluid="md">
  //     <h1>Chattei!!</h1>
  //     { children }
  // // </Container>
  return (
    <React.Fragment>
      <h1>Chattei!!</h1>
      {children}
    </React.Fragment>
  );
}

export default LayoutContainer;
