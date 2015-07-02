import Debug from 'debug';
import AppStore from '../stores/app';
import Vaani from '../lib/vaani';
import TalkieActions from './talkie';


let debug = Debug('StandingByActions');


class StandingByActions {
  /**
   * Initializes a Vaani instance
   */
  static setupSpeech () {
    debug('setupSpeech');

    this.vaani = new Vaani({
      grammar: `
        #JSGF v1.0;
        grammar fxosVoiceCommands;
        public <simple> =
          call home |
          dial home |
          check my messages |
          text david |
          whats my battery level |
          open my calendar |
          open my email |
          open my messages
        ;
      `,
      interpreter: this._interpreter,
      onSay: this._onSay,
      onListen: this._onListen
    });
  }

  /**
   * Greets the user and waits for a response
   */
  static greetUser () {
    debug('greetUser');

    this.vaani.say('How may I help you?', true);
  }

  /**
   * Interprets the result of speech recognition
   * @param err {Error|null} An error if speech was not understood
   * @param command {String} Text returned from the speech recognition
   */
  static _interpreter (err, command) {
    debug('_interpreter', arguments);

    TalkieActions.setActiveAnimation('none');

    if (err) {
      console.log('error: ' + err);
    }

    console.log('interpret: ' + command);
  }

  /**
   * A hook that's fired when Vaani's say function is called
   * @param sentence {String} The sentence to be spoken
   * @param waitForResponse {Boolean} Indicates we will wait for a
   *        response after the sentence has been said
   */
  static _onSay (sentence, waitForResponse) {
    debug('_onSay', arguments);

    AppStore.state.standingBy.text = sentence;

    TalkieActions.setActiveAnimation('sending');
    TalkieActions.setMode('none');
  }

  /**
   * A hook that's fired when Vaani's listen function is called
   */
  static _onListen () {
    debug('_onListen');

    AppStore.state.standingBy.text = '';

    TalkieActions.setActiveAnimation('receiving');
  }

  /**
   * The action that handles mic toggles
   */
  static toggleMic () {
    debug('toggleMic');

    if (this.vaani.isSpeaking || this.vaani.isListening) {
      this.vaani.cancel();

      AppStore.state.standingBy.text = '';

      TalkieActions.setActiveAnimation('none');
      TalkieActions.setMode('none');

      return;
    }

    this.greetUser();
  }
}


export default StandingByActions;
