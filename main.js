var express = require('express')
var app = express()
var fs = require('fs');
var qs = require('querystring');
var template = require('./lib/template.js');
var compression = require('compression');

/* routes */
var topicRoute = require('./routes/topic');
app.use('/topic', topicRoute); // /topic으로 시작하는 주소들에게 topicRoute라는 미들웨어를 적용하겠다.는 뜻

/* compression */
app.use(compression());

/* how to serve static files */
/* 정적인 파일을 서비스하려면 경로를 설정하여 작업하면 된다. */
app.use(express.static('public')); // public 디렉토리 안에서 파일을 찾겠다


/* body-parser middle-ware use */
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

/* how to make middle-ware */
/* reqeust의 list property를 사용하여 반복을 줄임 */
/* 메소드가 get 방식의 요청만 처리 */
app.get('*', function (request, response, next) {
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});

//route, routing
//app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', function (request, response) {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">`,
    `<a href="/topic/create">create</a>`
  );
  response.send(html);
});

/* 에러처리 */
app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
