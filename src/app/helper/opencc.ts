import { dictionaries } from './dictionary';

const cachedDictionaries = {};

function getDictionary(name, options = { reverse: false }) {
  const cacheName = options.reverse ? `R_${name}` : name;
  const dictionary = cachedDictionaries[cacheName];

  return dictionary || (cachedDictionaries[cacheName] = dictionaries[name].reduce((map, entry) => {
    const first = options.reverse ? 1 : 0;

    map[entry[first]] = entry[1 - first];

    return map;
  }, {}));
}

function convertChain(input, chains) {
  return chains.reduce((_input, chain) => {
    const _dictionaries = chain.slice();

    _dictionaries.splice(0, 0, {});

    return translate(_input, Object.assign.apply(null, _dictionaries));
  }, input);
}

export const hongKongToSimplified = function (text) {
  return convertChain(text, [
    [
      getDictionary('HKVariantsRevPhrases'),
      getDictionary('HKVariants', { reverse: true })
    ],
    [
      getDictionary('TSPhrases'),
      getDictionary('TSCharacters')
    ],
  ]);
};

export const simplifiedToHongKong = function (text) {
  return convertChain(text, [
    [
      getDictionary('STPhrases'),
      getDictionary('STCharacters')
    ],
    [
      getDictionary('HKVariantsPhrases'),
      getDictionary('HKVariants')
    ]
  ]);
};

export const simplifiedToTraditional = function (text) {
  return convertChain(text, [
    [
      getDictionary('STPhrases'),
      getDictionary('STCharacters')
    ]
  ]);
};

export const simplifiedToTaiwan = function (text) {
  return convertChain(text, [
    [
      getDictionary('STPhrases'),
      getDictionary('STCharacters')
    ],
    [
      getDictionary('TWVariants')
    ]
  ]);
};

export const simplifiedToTaiwanWithPhrases = function (text) {
  return convertChain(text, [
    [
      getDictionary('STPhrases'),
      getDictionary('STCharacters')
    ],
    [
      getDictionary('TWPhrasesIT'),
      getDictionary('TWPhrasesName'),
      getDictionary('TWPhrasesOther'),
      getDictionary('TWVariants')
    ]
  ]);
};

export const traditionalToHongKong = function (text) {
  return convertChain(text, [
    [
      getDictionary('HKVariants')
    ]
  ]);
};

export const traditionalToSimplified = function (text) {
  return convertChain(text, [
    [
      getDictionary('TSPhrases'),
      getDictionary('TSCharacters')
    ]
  ]);
};

export const traditionalToTaiwan = function (text) {
  return convertChain(text, [
    [
      getDictionary('TWVariants')
    ]
  ]);
};

export const taiwanToSimplified = function (text) {
  return convertChain(text, [
    [
      getDictionary('TWVariantsRevPhrases'),
      getDictionary('TWVariants', { reverse: true })
    ],
    [
      getDictionary('TSPhrases'),
      getDictionary('TSCharacters')
    ]
  ]);
};

export const taiwanToSimplifiedWithPhrases = function (text) {
  return convertChain(text, [
    [
      getDictionary('TWVariantsRevPhrases'),
      getDictionary('TWVariants', { reverse: true })
    ],
    [
      getDictionary('TWPhrasesIT', { reverse: true }),
      getDictionary('TWPhrasesName', { reverse: true }),
      getDictionary('TWPhrasesOther', { reverse: true })
    ],
    [
      getDictionary('TSPhrases'),
      getDictionary('TSCharacters')
    ]
  ]);
};

function translate(text, dictionary) {
  const maxLength = Object.keys(dictionary).reduce((_maxLength, word) => Math.max(_maxLength, word.length), 0);
  const translated = [];

  for (let i = 0, { length } = text; i < length; i++) {
    let found;

    for (let j = maxLength; j > 0; j--) {
      const target = text.substr(i, j);

      if (Object.hasOwnProperty.call(dictionary, target)) {
        i += j - 1;
        translated.push(dictionary[target]);
        found = 1;
        break;
      }
    }

    if (!found) {
      translated.push(text[i]);
    }
  }

  return translated.join('');
}
