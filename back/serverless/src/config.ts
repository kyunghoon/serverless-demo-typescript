if (!process.env.NODE_ENV) throw new Error('NODE_ENV not set');

export default require(`../envs/${process.env.NODE_ENV}`).default; // eslint-disable-line import/no-dynamic-require
