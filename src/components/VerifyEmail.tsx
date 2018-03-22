import * as React from 'react';

export class VerifyEmail extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      email: '',
      response: []
    }
  }
  verifyEmail(email: any) {
    // var corsApiUrl = 'https://cors-anywhere.herokuapp.com/';
    var corsApiHost = 'cors-anywhere.herokuapp.com';
    var corsApiUrl = 'https://' + corsApiHost + '/';

    var u = new URLSearchParams();
    u.append('email', email);
    u.append('method', 'flickr.interestingness.getList');
    // Verify Single Email apikey
    u.append('api_key', 'test_4f197423c9ab24202ae309f578a19e4db229198c2c5729e0b64cff6139cbb761');
    // Verify List of emails apikey
    // u.append('api_key', 'live_07d3033b928d25d709c7d54bc58a60762dc57dbfc4effcf463bcef11389a852e');
    u.append('format', 'json');

    var apiCall = fetch(corsApiUrl + 'https://api.kickbox.com/v2/verify?' + u);

    apiCall.then(response => {
      return response.json();
    }).then(result => {
      console.log(result);
      this.setState({
        response: result
      })
    });
  }

  componentDidUpdate(prevProps: any, prevState: any) {
      const { email } = this.state;
      if(email !== prevState.email){
          console.log('update email!');
          this.verifyEmail(email);
      }

  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.setState({
      email: this.state.email
    })
  }

  render() {
    console.log('verify email state: ', this.state);
    return (
      <div>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input
            type='text'
            placeholder='someone@example.com'
            value={ this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })} />
          <button type='submit'>Check Email</button>
        </form>
        {/* <section>{ Render messages here }</section> */}
      </div>
    )
  }
}

// interface IProps {
//   email: string;
// }

interface IState {
  email: string;
  response: Array<string>;
}
