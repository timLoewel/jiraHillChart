module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/steps/**/*.ts'],
    format: ['summary', 'progress-bar'],
    paths: ['features/**/*.feature'],
  },
};
