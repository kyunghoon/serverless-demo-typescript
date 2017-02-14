const Twitter = require('twitter');

import config from '../../../config';

if (!config.TWITTER_CONSUMER_KEY) throw new Error('TWITTER_CONSUMER_KEY not set');
if (!config.TWITTER_CONSUMER_SECRET) throw new Error('TWITTER_CONSUMER_SECRET not set');
if (!config.TWITTER_ACCESS_TOKEN_KEY) throw new Error('TWITTER_ACCESS_TOKEN_KEY not set');
if (!config.TWITTER_ACCESS_TOKEN_SECRET) throw new Error('TWITTER_ACCESS_TOKEN_SECRET not set');

const client = new Twitter({
  consumer_key: config.TWITTER_CONSUMER_KEY,
  consumer_secret: config.TWITTER_CONSUMER_SECRET,
  access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET,
});

const search = (query: string, count = 0, lang = 'en') => {
  return new Promise((resolve, reject) => {
    client.get('search/tweets', {
      lang,
      count,
      q: query,
    }, (err: any, tweets: { statuses: any }, response: any) => {
      if (err) {
        console.error(err);
        reject(JSON.stringify(err));
        return;
      }
      if (!tweets || !tweets.statuses) {
        reject('invalid twitter response');
        return;
      }
      resolve(tweets.statuses);
    });
  });
};

const create = (source: any, query: string) => {
  console.log('SOURCE:', source, 'QUERY:', query);
};

export default {
  search,
  create,
};
