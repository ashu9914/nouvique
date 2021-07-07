import React from 'react';

import { Result } from 'neverthrow';
import { Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { resolveRESTCall } from '../utils';

import BasePage from './elements/BasePage';

import './ProfileView.css';

interface ApiTest {
  blah: string
}

interface MatchParams {
  user_name: string
}

interface ProfileViewProps extends RouteComponentProps<MatchParams> { }

interface ProfileViewState {
  apiValue: ApiTest
}

export default class ProfileView extends React.Component<ProfileViewProps, ProfileViewState> {
  constructor(props: ProfileViewProps) {
    super(props);

    console.log(props.match.params.user_name);

    this.state = {
      apiValue: {
        blah: ""
      }
    };
  }

  async componentDidMount() {
    const result: Result<ApiTest, Error> = await resolveRESTCall<ApiTest>('/');

    result
      .map(res => {
        this.setState({ apiValue: res });

        return null; // necessary to silence warning
      })
      .mapErr(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <React.Fragment>
        <BasePage>
          <Row>
            <h1>
              {this.props.match.params.user_name}'s Profile
            </h1>
          </Row>

          <Row>
            <div>
              {this.state.apiValue.blah}
            </div>
          </Row>
        </BasePage>
      </React.Fragment>
    );
  }
}