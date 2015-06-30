/* global speechSynthesis */

class Vaani {
  /**
   * @constructor
   * @param options {Object}
   * @param options.grammar {String} The JSGF 1.0 grammar list to be
   *        used by the speech recognition library
   * @param options.interpreter {Function} The function to call after
   *        speech recogition is attempted
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
   * Says a sentence and optionally wait for a response
   * @param sentence {String} The sentence to be spoken
   * @param waitForResponse {Boolean} Indicates we will wait for a
   *        response after the sentence has been said
   */
  say (sentence, waitForResponse) {
    if (waitForResponse) {
      this._interpretingCommand = true;
    }

    var lang = 'en'; // Aus: should be detected based on system language
    var sayItProud;

    // Reza: This is a temporary solution to help dev in the browser
    if (!navigator.userAgent.indexOf('Mobile') > -1) {
      sayItProud = () => {
        var audio = document.createElement('audio');
        var url = 'http://speechan.cloudapp.net/weblayer/synth.ashx';
            url += '?lng=' + lang;
            url += '&msg=' + sentence;

        audio.src = url;
        audio.setAttribute('autoplay', 'true');
        audio.addEventListener('ended', () => {
          if (waitForResponse) {
            this.listen();
          }
        });
      };
    }
    else {
      sayItProud = () => {
        var utterance = new SpeechSynthesisUtterance(sentence);

        utterance.lang = lang;
        utterance.addEventListener('end', () => {
          if (waitForResponse) {
            this.listen();
          }
        });

        speechSynthesis.speak(utterance);
      };
    }

    // Aus: Wait an extra 100ms for the audio output to stabilize off
    setTimeout(sayItProud.bind(this), 100);
  }

  /**
   * Listen for a response from the user
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
          // Aus: This is useless right now but the idea is we wouldn't
          // always complete the action or command requested if the
          // confidence level is too low
          confidence = event.results[i][0].confidence;
        }
        else {
          partialTranscript += event.results[i][0].transcript;
          // Aus: In theory, partial transcripts shouldn't be used
          // as their confidence will always be lower than a final
          // transcript. We should ask the user to repeat what they
          // want when all we have is a partial transcript with 'low'
          // confidence.

          confidence = event.results[i][0].confidence;
        }
      }

      // Aus: We'll fall back to the partial transcript if there
      // isn't a final one for now. It actually looks like we never
      // get a final transcript currently.
      var usableTranscript = transcript || partialTranscript;

      // Aus: Ugh. This is really crappy error handling
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
