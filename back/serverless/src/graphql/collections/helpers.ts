export const objectEntries = (o: { [key: string]: any }): any[][] =>
  Object.keys(o).filter(k => !o.hasOwnProperty || (o.hasOwnProperty && o.hasOwnProperty(k)) ).map(k => [k, o[k]]);

export const promisify = <R, P>(fn: (params: P, cb: (err: any, data: R) => void) => void) => (params: P): Promise<R> => {
  return new Promise<R>((resolve, reject) => {
    fn(params, (err, data: R) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
