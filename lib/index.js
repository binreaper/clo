const http = require('http');
const Route = require('route-parser');

function clo(){
  return new router();
}

function router(req,res){
  this.routes = [];
}

router.prototype = {
  get(path,...arguments){
    this.routes.push({
      url:path,
      method:'GET',
      handlers:arguments
    });
  },

  post(path,...arguments){
    this.routes.push({
      url:path,
      method:'POST',
      handlers:arguments
    });
  },

  listen(port,cb){
    http.createServer(
      (req,res)=>{
        const method = req.method;
        const url = req.url;
        const matchingRoute = this.routeMatcher(method,url,req);

        if(!matchingRoute){
          res.statusCode=404;
          res.end("Not Found");
        }

        const response = this._executeHandlers(req,res,matchingRoute);

        if(!response){
          setTimeout(()=>{
            res.end("Timedout!");
          },1000);
        }else{
          res.end(response)
        }

      }  
    ).listen(port,cb);
  },

  _executeHandlers(req,res,routeDefinition){
    if(!routeDefinition || !routeDefinition.handlers[0]){
      return null;
    }

    let validReponse = routeDefinition.handlers[0](req,res);

    if(typeof validReponse === 'object'){
      validReponse = JSON.stringify(validReponse);
    }

    return validReponse;
  },

  routeMatcher(method,url,req){
    return this.routes.find(item=>{
      const urlRoute = new Route(item.url);
      const matchingItems = urlRoute.match(url);
      req.params = JSON.parse(JSON.stringify(matchingItems));
      return method === method && matchingItems;
    });
  }

}


module.exports = clo;

