import React from 'react';

import { Row } from 'react-bootstrap';

import { resolveRESTCall } from '../utils';

import './HomeView.css';

interface ApiTest {
  blah: string
}

interface HomeViewProps {}

interface HomeViewState {
  apiValue: ApiTest
}

export default class HomeView extends React.Component<HomeViewProps, HomeViewState> {
  constructor(props: HomeViewProps) {
    super(props);

    this.state = {
      apiValue : {
        blah : ""
      }
    };
  }

  async componentDidMount() {
    const result = await resolveRESTCall<ApiTest>('/');
    
    result
      .map(res => {
        this.setState({ apiValue : res });

        return null; // necessary to silence warning
      })
      .mapErr(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <React.Fragment>
        <div className='mainbody'>
          <Row>
            <h1>
              Home
            </h1>
          </Row>

          <Row>
            <div>
              {this.state.apiValue.blah}
            </div>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}