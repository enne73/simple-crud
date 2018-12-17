var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var moment = require('moment');
var _ = require('lodash');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var db = require('./config/database');

var app = express();

// swagger
var swaggerOpt = {
  explorer : false,
  customCss: '.swagger-ui .topbar { display: none }'
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOpt));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerHelper('section', function(name, options) {
  if (!this._sections) this._sections = {};
  this._sections[name] = options.fn(this);
  return null;
});
hbs.registerHelper('fromnow', function(dt) {
	moment.locale('it');
  return moment(dt).fromNow();
});
hbs.registerHelper('gt',function(v1, v2) {
	return v1 > v2;
});
hbs.registerHelper('pager', function(current, total) {
  let html = '';
  html += '<nav>';
  html += '  <ul class="pagination justify-content-center">';
  for(let page = 1; page <= total; page++)  {
    html += '<li class="page-item' + (page == current ? ' disabled' : '')+ '"><a class="page-link" href="/users/paginate/' + page + '">' + page + '</a></li>';
  }
  html += '</ul>';
  html += '</nav>';
  return html;
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/javascripts/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/stylesheets/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/stylesheets/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/'));

function modify(req, res, next){
  console.log('================================================');
console.log(res.body)
  next();
}
app.use(modify);

app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
