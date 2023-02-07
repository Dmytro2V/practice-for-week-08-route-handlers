const http = require('http');
const { runInNewContext } = require('vm');

let nextDogId = 1;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }
    // Do not edit above this line
    

    // define route handlers here
    if (req.method === 'GET' && req.url === '/') {
      res.statusCode = 200;
      res.setHeader('Content-Type','text/plain');
      res.body = 'Dog Clubs';
      return res.end(res.body);
    };
    if (req.method === 'GET' && req.url === '/dogs') {
      res.statusCode = 200;
      res.setHeader('Content-Type','text/plain');
      //res.body = 'Dogs index';
      return res.end('Dogs index')
    };
   // bonus Endpoints tasks:
   let url = req.url
   let urlParts = url.split('/')
   if (req.method === 'GET' && url.startsWith('/dogs/new')) {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.body = 'Dog create from page';
    return res.end(res.body)
  }; 
  if (req.method === 'GET' && url.startsWith('/dogs/') && urlParts.length === 3 && urlParts[3]) {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.body = 'Dog edit from page for dogId:' + urlParts[3];
    return res.end(res.body)
  };
   if (req.method === 'GET' && url.startsWith('/dogs/') && urlParts[2]) {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.body = 'Dog details for dogid:' + urlParts[2];
    return res.end(res.body)
  };
  if (req.method === 'POST' && url ==='/dogs') {
    res.statusCode = 302;    
    res.setHeader('Location','/dogs/' + getNewDogId()) ;
    return res.end()
  };
  if (req.method === 'POST' && url.startsWith('/dogs/') && urlParts[2]) {
    res.statusCode = 302;     
    res.setHeader( 'Location','/dogs/' + urlParts[2]) ;
    return res.end()
  };



    // Do not edit below this line
    // Return a 404 response when there is no matching route handler
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('No matching route handler found for this endpoint');
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));