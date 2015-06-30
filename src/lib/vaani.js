/* global speechSynthesis */

class Vaani {
  /**
   * Constructs a new instance
   *
   * @param options An options object
   * @param options.grammar The grammar list used by the speech recognition
   * @param options.interpreter The function to call after speech recogition is attempted.
   */
  constructor (options = {}) {
    if (!options.hasOwnProperty('grammar')) {
      throw Error('Missing required `grammar` option.');
    }

    if (!options.hasOwnProperty('interpreter')) {
      throw Error('Missing required `interpreter` option.');
    }

    this.speechGrammarList = new SpeechGrammarList();
    this.speechGrammarList.addFromString(options.grammar, 1);
    this.speechRecognition = new SpeechRecognition();
    this._interpreter = options.interpreter;
    this._interpretingCommand = false;
  }

  /**
   * Say a sentence to the user and optionally wait for a response.
   *
   * @param sentence The sentence to be spoken.
   * @param isWaitingForCommandResponse Indicates we will wait for a response
   *                                    after the sentence has been said.
   */
  say (sentence, isWaitingForCommandResponse) {
    if (isWaitingForCommandResponse) {
      this._interpretingCommand = true;
    }

    var lang = 'en'; // XXX: should be detected based on system language
    var sayItProud;

    // use built-in speech synthesis
    if (navigator.userAgent.indexOf('Mobile') > -1) {
      sayItProud = () => {
        var speechSynthesisUtterance = new SpeechSynthesisUtterance(sentence);

        speechSynthesisUtterance.lang = lang;
        speechSynthesisUtterance.addEventListener('end', () => {
          if (isWaitingForCommandResponse) {
            this.listen();
          }
        });

        speechSynthesis.speak(speechSynthesisUtterance);
      };
    }
    // XXX: To be removed. This is a temporary solution to help dev in the browser.
    else {
      sayItProud = () => {
        var audio = document.createElement('audio');
        var url = 'http://speechan.cloudapp.net/weblayer/synth.ashx?lng=' + lang;
            url += '&msg=' + sentence;

        audio.src = url;
        audio.setAttribute('autoplay', 'true');
        audio.addEventListener('ended', () => {
          if (isWaitingForCommandResponse) {
            this.listen();
          }
        });
      };
    }

    // Wait an extra 100ms for the audio output to stabilize off.
    setTimeout(sayItProud.bind(this), 100);
  }

  /**
   * Listen for a response from the user.
   */
  listen () {
    this.speechRecognition.start();

    this.speechRecognition.onresult = (event) => {
      this._interpretingCommand = false;

      var transcript = '';
      var partialTranscript = '';
      var confidence = 0;
      var isFinal = false;

      // Assemble the transcript from the array of results
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          isFinal = true;
          transcript += event.results[i][0].transcript;
          // XXXAus: This is useless right now but the idea is we wouldn't
          //         always complete the action or command requested if the
          //         confidence level is too low.
          confidence = event.results[i][0].confidence;
        }
        else {
          partialTranscript += event.results[i][0].transcript;
          // XXXAus: In theory, partial transcripts shouldn't be used as their
          //         confidence will always be lower than a final transcript.
          //         We should ask the user to repeat what they want when all
          //         we have is a partial transcript with 'low' confidence.
          confidence = event.results[i][0].confidence;
        }
      }

      // XXXAus: We'll fall back to the partial transcript if there isn't a
      //         final one for now. It actually looks like we never get a
      //         final transcript currently.
      var usableTranscript = transcript || partialTranscript;

      // XXXAus: Ugh. This is really crappy error handling.
      if (usableTranscript == "ERROR") {
        var getOffMyLawn = new Error('Unrecognized speech.');
        this._interpreter(getOffMyLawn);
      }
      else if (usableTranscript.length) {
        this._interpreter(null, usableTranscript);
      }
    };
  }
}


export default Vaani;
