class BigSpaceVoiceRecognition {

    constructor() {
        this.finalTranscript = '';

        this.start_timestamp;

        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;
        }
    }

    initGrammar() {
        var grammar = '#JSGF V1.0; grammar colors; public <color> = red | blue | green  ;'

        let speechRecognitionList = new webkitSpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        this.recognition.grammars = speechRecognitionList;
    }

    startListening( retry) {
        try {
            this.finalTranscript = '';
            this.recognition.lang = 'English';

            this.start_timestamp = new Date().getTime();
            console.log( this.recognition.grammars.length);
            this.recognition.start();
            console.log('Please Start Talking');
        } catch (e) {
            try {
                // probably already capturing
                console.error( `Could not start listening, try again enabled: ${retry} ${e}`)
                this.recognition.stop();
            } catch (e) {
            }
    
            if ( retry) {
                setTimeout( () => { this.startListening( false) }, 1000);
            }
        }
    }

    go() {
        console.log('Initialising voice this.recognition on BigSpace');

        if ('webkitSpeechRecognition' in window) {

            this.initGrammar();

            this.recognition.onstart = () => {
                console.log('info_speak_now');
                //start_img.src = '/intl/en/chrome/assets/common/images/content/mic-animate.gif';
            };

            this.recognition.onerror =  (event) => {
                if (event.error == 'no-speech') {
                    //start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
                    console.log('info_no_speech');
                }
                if (event.error == 'audio-capture') {
                    //start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
                    console.log('info_no_microphone');
                }
                if (event.error == 'not-allowed') {
                    if (event.timeStamp - this.start_timestamp < 100) {
                        console.log('info_blocked');
                    } else {
                        console.log('info_denied');
                    }
                }
            };

            this.recognition.onend =  () => {

            };

            this.recognition.onresult = (event) => {

                try{
                    this.recognition.onend = null;
                    this.recognition.stop();
                } catch ( e){}

                if (typeof(event.results) == 'undefined') {
                    return;
                }
console.log( event.results)
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        this.finalTranscript += event.results[i][0].transcript;
                    }
                }

                console.log(this.finalTranscript);

            };

            this.recognition.onspeechend = () => {
                this.recognition.stop();
            };

            document.addEventListener( 'dblclick', () => {
                this.startListening( true);
            });
        }
    }
}

let bigSpaceVoiceRecognition = new BigSpaceVoiceRecognition();
bigSpaceVoiceRecognition.go();
