import * as React from 'react';
const ReactAutocomplete = require('react-autocomplete') as any;

export class VerifyEmail extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      verifierResponseObj: [],
      email: '',
      value: '',
      emailError: '',
      commonExts: [
        { id: 1, label: 'gmail.com' },
        { id: 2, label: 'yahoo.com' },
        { id: 3, label: 'hotmail.com' },
        { id: 4, label: 'ymail.com' },
        { id: 5, label: 'msn.com' },
        { id: 6, label: 'email.com' },
        { id: 7, label: 'gmail.co.uk' },
      ]
    }
  }
  verifyEmail = (email: string) => {
    const corsApiHost = 'cors-anywhere.herokuapp.com',
          corsApiUrl  = 'https://' + corsApiHost + '/',
          apiKey      = 'test_69bb5938b71f9418d431b954a3a8606501fd4673771c91eecba3419a40b5ce55',
          // spareApiKey = 'test_4f197423c9ab24202ae309f578a19e4db229198c2c5729e0b64cff6139cbb761',
          URL         = 'https://api.kickbox.com/v2/verify?';

    let UrlParams = new URLSearchParams();
    UrlParams.append('email', email);
    UrlParams.append('api_key', spareApiKey);
    UrlParams.append('format', 'json');

    const apiCall = fetch(corsApiUrl + URL + UrlParams);

    apiCall.then(response => {
      return response.json();
    }).then(result => {
      console.log(result);
      this.setState({
        verifierResponseObj: result
      })
    });
  }

  validate = () => {
    let regex         = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        isValidFormat = regex.test(this.state.email),
        isError       = false;

    if(!isValidFormat) {
      isError = true;
      this.setState({
        verifierResponseObj: [],
        emailError: 'Email should be in the format: someone@example.com'
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
    let commonExts = this.state.commonExts.map(obj => obj.label);
    // below I am counting the number of @ signs
    let atSignCounter = this.state.value.length - this.state.value.replace(new RegExp('@', 'g'), '').length == 1;
    // if we have only one @ sign and the entered extension(if entered) is not one of the popular extensions, then the list will popup
    let shouldPopUp = atSignCounter && !(commonExts.indexOf(enteredExt) > -1)
    return shouldPopUp;
  }

  render() {
    let verifierResponse = JSON.parse(JSON.stringify(this.state.verifierResponseObj));
    return (
      <div className='form-containr'>
        <section className='email-format-errors'>
          {
            this.state.emailError
          }
        </section>
        <form onSubmit={ e => this.handleSubmit(e) }>
          <ReactAutocomplete
            inputProps={{ placeholder: 'example@domain.com' }}
            items={ this.state.commonExts }
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
        <section className='verify-email-results'>
          <div>
            { verifierResponse.result }
          </div>
        </section>
      </div>
    )
  }
}

export interface extensionsArray {
    id: number;
    label: string;
}

export interface verifierResponseObj {
  result: string;
  // Below 👇 is the entire object key-values but, we just need result for the purpose of this test
  accept_all: boolean;
  did_you_mean: any;
  disposable: boolean;
  domain: string;
  email: string;
  free: boolean;
  message: string;
  reason: string;
  role: boolean;
  sendex: number;
  success: boolean;
  user: string;
}


interface IState {
  email: string;
  verifierResponseObj: Array<verifierResponseObj>;
  value: string;
  emailError: string;
  commonExts: Array<extensionsArray>;
}
