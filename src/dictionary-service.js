const request = require('request')

const url = process.env.YANDEX_API_HOST + '?key=' + process.env.YANDEX_API_KEY + '&lang=en-en&text='

const dictionaryService = async function (words) {
  return Promise.all(words.map((word) => getDataFromDictionaryApi(url + word[0], words, word[0])))
    .then((results) => {
      return {status: true, data: results}
    })
    .catch((err) => {
        return {status: false}
    });
};

function getDataFromDictionaryApi(url, words, word) {
    const wordsMap = new Map(words)
    return new Promise(function (resolve, reject) {
      request.get(url, { json: true }, function (error, data) {
        if (error) {
          reject(error);
        } else {
            let def = data.body.def
            let synonyms = null
            if(typeof def[0] !== 'undefined' &&
                typeof def[0]['tr'] !== 'undefined'){
                synonyms = def[0]['tr'].map(x => {
                    if(x.syn){
                        return x.syn.map(y => y.text).join(', ')
                    }else{
                        return null
                    }
                }).filter((el) => el != null).join(', ')
            }

            resolve({
                occurrence: wordsMap.get(word),
                word: word,
                pos: typeof def[0] !== 'undefined' ? def[0].pos : null,
                synonyms: synonyms
            });
        }
      });
    });
  }

module.exports = dictionaryService;
