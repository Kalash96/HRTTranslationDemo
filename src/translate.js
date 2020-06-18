const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const config = {
  apikey: "0fYiBsUedAMZjAjOxzWIUOQc8KhcYJlFPAmYnNPrOU-u",
  version: "2018-05-01",
  url: "https://gateway-fra.watsonplatform.net/language-translator/api"
}

/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

/**
  *
  * main() will be run when teh action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {
  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';

  return new Promise(async function (resolve, reject) {

    try {

      // *******TODO**********
      // - Call the language translation API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#translate
      // - if successful, resolve exatly like shown below with the
      // translated text in the "translation" property,
      // the number of translated words in "words"
      // and the number of characters in "characters".

      // in case of errors during the call resolve with an error message according to the pattern
      // found in the catch clause below

      // pick the language with the highest confidence, and send it back
      const languageTranslator = new LanguageTranslatorV3({
        version: config.version,
        authenticator: new IamAuthenticator({
          apikey: config.apikey,
        }),
        url: config.url,
        disableSslVerification: true,
      });

      const translateParams = {
        text: params.body.text,
        source: params.body.language,
        target: defaultLanguage
      }

      languageTranslator.translate(translateParams)
      .then(translationResult  => {
        resolve({
          statusCode: 200,
          body: {
            translations: translationResult,
            words: translationResult.word_count,
            characters: translationResult.character_count,
          },
          headers: { 'Content-Type': 'application/json' }
        });
      })
      .catch(err => {
        console.log('error:', err);
        reject(err);
      });

    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}
