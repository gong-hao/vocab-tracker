const utterance = new SpeechSynthesisUtterance();

utterance.lang = 'en-US';

const speaker = {
  say: (content, endCallback?, startCallback?) => {
    if (!content) {
      throw new Error('need content');
    }
    if (startCallback) {
      startCallback();
    }
    if (speaker.voice === 'SSU') {
      window.speechSynthesis.cancel();
      utterance.text = content;
      window.speechSynthesis.speak(utterance);
      return false;
    }
    if (content.length <= 100) {
      audioPlay(content, endCallback);
    } else {
      const sentenceList = content.split(/[,|.|"]/g)
        .map(x => x.trim())
        .filter(x => x !== '');
      loopPlay(sentenceList, 0, endCallback);
    }
  },
  saySpelling: (content, endCallback, startCallback) => {
    content = content.split('').join(' ');
    speaker.say(content, endCallback, startCallback);
  },
  stop: () => {
    const audio: any = document.getElementById('tts');
    audio.pause();
  },
  voice: 'usenglishfemale'
};

const audioPlay = (sentence, callback) => {
  const audio: any = document.getElementById('tts');
  if (speaker.voice === 'google') {
    // audio.src = '/tts?q=' + encodeURIComponent(sentence);
    audio.src = 'http://translate.google.com/translate_tts?ie=utf-8&tl=en&q=' + encodeURIComponent(sentence);
  } else if (speaker.voice === 'baidu') {
    audio.src = 'https://fanyi.baidu.com/gettts?lan=uk&spd=3&source=web&text=' + encodeURIComponent(sentence);
  } else {
    audio.src =
      'http://api.ispeech.org/api/rest?apikey=ispeech-listenbutton-betauserkey&action=convert&format=mp3&e=audio.mp3' +
      '&voice=' + speaker.voice +
      '&speed=0' +
      '&text=' + encodeURIComponent(sentence);
  }

  audio.play();

  audio.onended = function () {
    if (callback) {
      callback();
    }
  };
};

const loopPlay = (sentenceList, index, callback) => {
  if (index <= sentenceList.length - 1) {
    audioPlay(sentenceList[index], function () {
      loopPlay(sentenceList, index + 1, callback);
    });
  } else {
    if (callback) {
      callback();
    }
  }
};

export const Speaker = speaker;
