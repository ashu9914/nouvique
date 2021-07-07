import React from 'react';

// import { Row } from 'react-bootstrap';

import NavBar from './NavBar';

import './BasePage.css';

interface Props { }

interface State { }

export default class BasePage extends React.PureComponent<Props, State> {
  // constructor(props: Props) {
  //   super(props);
  // }

  render() {
    return (
      <React.Fragment>
        <NavBar />

        <div className='mainbody'>
          {this.props.children}
        </div>
      </React.Fragment>
    )
  }
}