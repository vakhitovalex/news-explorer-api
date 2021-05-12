const { connect } = require('mongoose');
const { config } = require('dotenv');

const { NODE_ENV, DB_URI } = process.env;

module.exports = () => {
  config();
  connect(
    NODE_ENV === 'production'
      ? DB_URI
      : 'mongodb://localhost:27017/news-explorer',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  );
};
