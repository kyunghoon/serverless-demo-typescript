import * as domain from 'domain';

export default (event: any, context: any, next: any) => {
  const d = domain.create();
  d.on('error', (err: any) => {
    console.error('DOMAIN ERROR:', err.message, err.stack);

    // Note: we're in dangerous territory!
    // By definition, something unexpected occurred,
    // which we probably didn't want.
    // Anything can happen now!  Be very careful!

    try {
      // make sure we close down within 3 seconds
      const killtimer = setTimeout(() => {
        process.exit(1);
      }, 3000);
      // But don't keep the process open just for that!
      killtimer.unref();

      const response = {
        statusCode: 200,
        body: 'Oops, there was a problem',
      };
      next(null, response);
    } catch (err2) {
      // oh well, not much we can do at this point.
      console.error('ERROR: could not send 500!', err2.stack);
    }
  });
  d.add(event);
  d.add(context);
  d.add(next);
  d.run(() => {
    const config = require('./config').default;
    const graphql = require('./graphql').default;

    if (event.headers) {
      const headers: {[key: string]: string;} = {};
      Object.keys(event.headers).forEach(key => {
        headers[key.toLowerCase()] = event.headers[key];
      });

      // only allow json
      if (headers['content-type'] !== 'application/json') {
        throw new Error('expected json');
      }
    }

    let json = null;
    try {
      json = JSON.parse(event.body);
    } catch (e) {
      throw new Error(`failed to parse body: ${event.body}`);
    }

    if (!json.query) {
      throw new Error('neither query nor variables not defined in the request');
    }

    graphql(json.query, json.variables)
      .then((result: any) => {
        // unhandled exceptions that occur in client graphql do not
        // propagate to the catch handler, instead are handled here
        if (result.errors && result.errors.length > 0 && result.errors[0] instanceof Error) {
          throw result.errors[0];
        }
        next(null, {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': `${config.CORS_ALLOW_ORIGIN}`, // Required for CORS support to work
          },
          body: JSON.stringify(result),
        });
      }).catch((err: any) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(err.stack);
        }
        next(null, {
          statusCode: 400,
          body: JSON.stringify(err.message),
        });
      });
  });
};
