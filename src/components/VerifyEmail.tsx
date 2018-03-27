import * as React from 'react';
const ReactAutocomplete = require('react-autocomplete') as any;

export class VerifyEmail extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      response: [],
      email: '',
      value: '',
      emailError: '',
      initialExts: [
        { id: 1, label: 'gmail.com' },
        { id: 2, label: 'yahoo.com' },
        { id: 3, label: 'hotmail.com' },
        { id: 4, label: 'ymail.com' },
        { id: 5, label: 'msn.com' },
        { id: 6, label: 'email.com' },
        { id: 7, label: 'fastmail.com' },
      ]
    }
  }
  verifyEmail = (value: any) => {
    // var corsApiUrl = 'https://cors-anywhere.herokuapp.com/';
    var corsApiHost = 'cors-anywhere.herokuapp.com';
    var corsApiUrl = 'https://' + corsApiHost + '/';

    var u = new URLSearchParams();
    u.append('email', value);
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

  // componentDidUpdate(prevProps: any, prevState: any) {
  //     const { value } = this.state;
  //     if(value !== prevState.value){
  //         console.log('update email value!');
  //         this.verifyEmail(value);
  //     }
  //
  // }

  validate = () => {
    let regex         = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i),
        isValidFormat = regex.test(this.state.email),
        isError       = false;

    if(!isValidFormat) {
      isError = true;
      this.setState({
        emailError: 'email should be in the format someone@example.com'
      })
    }
    return isError;
  }

  handleSubmit = (e: any) => {
    e.preventDefault();

    const error = this.validate();
    if (!error) {
      this.setState({ emailError: '' });
      this.verifyEmail(this.state.email);
    }
  }

  popUpExtensions = () => {
    // getting entered extension by user if user has entered any or selected from popular extensions
    let enteredExt = this.state.value.slice(this.state.value.indexOf('@') + 1);
    // getting the label of popular extensions we already have in the state
    let initialExts = this.state.initialExts.map(obj => obj.label);
    // below I am counting the number of @ signs
    let atSignCounter = this.state.value.length - this.state.value.replace(new RegExp('@', 'g'), '').length == 1;
    // if we have only one @ sign and the entered extension(if entered) is not one of the popular extensions, then the list will popup
    let shouldPopUp = atSignCounter && !(initialExts.indexOf(enteredExt) > -1)
    return shouldPopUp;
  }

  render() {
    var responseObj = this.state.response;
    return (
      <div className='form-containr'>
        <section className='client-errors'>
          {
            this.state.emailError
          }
        </section>
        <form onSubmit={ e => this.handleSubmit(e) }>
          <ReactAutocomplete
            inputProps={{ placeholder: 'example@domain.com' }}
            items={ this.state.initialExts }
            shouldItemRender={ (item: any, value: any) => {
              return item.label.toLowerCase().indexOf(value.split('@').pop().toLowerCase()) > -1
            }
          }
          type='email'
          getItemValue={ item => item.label}
          renderItem=
          { (item, highlighted) =>
            <div
              key={item.id}
              style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}>
              { (this.popUpExtensions())? item.label : '' }
            </div>
          }
          value={ this.state.value }
          onChange={
              e => this.setState({
              value: e.target.value,
              email: e.target.value
            })
          }
          onSelect={
            emailExtension =>
              this.setState({
                value: this.state.value.slice(0, this.state.value.indexOf('@') + 1) + emailExtension,
                email: this.state.value.slice(0, this.state.value.indexOf('@') + 1) + emailExtension
              })
            }
          />
          <button type='submit'>VERIFY</button>
        </form>
        {/* <section className='verify-email-results'>
          {
            responseObj
          }
        </section> */}
      </div>
    )
  }
}

// interface IProps {
//     inputProps: string;
// }

export interface extensionsArray {
    id: number;
    label: string;
}

export interface responseObject {
  accept_all: boolean;
  did_you_mean: any;
  disposable: boolean;
  domain: string;
  email: string;
  free: boolean;
  message: string;
  reason: string;
  result: string;
  role: boolean;
  sendex: number;
  success: boolean;
  user: string;
}

interface IState {
  email: string;
  // response: Array<object>;
  response: Array<responseObject>;
  value: string;
  emailError: string;
  initialExts: Array<extensionsArray>;
}
