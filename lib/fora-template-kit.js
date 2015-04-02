var co = require("co");
var Isotropy = require("isotropy");
var koa = require("koa");

var init = function(options) {

    var staticDirectories = options.staticDirectories;
    var config = options.config;
    var routes = options.routes;
    var layout = options.layout;

    return co(function*() {
        var host = process.argv[2] || config.host || "127.0.0.1";
        var port = process.argv[3] || config.port || 8080;

        /* Init koa */
        var koa = require('koa');
        var app = koa();

        var isotropy = new Isotropy();
        isotropy.addStaticDirectories(["public", "js", "vendor", "css", "images", "fonts"], config.destination);
        isotropy.addPageRoutes(routes.pages, layout);
        yield* isotropy.init();

        app.use(isotropy.koaRoute());

        app.listen(port);

        var result = {
            host: host,
            port: port
        };

        if (options.cb)
            options.cb(result);
    });
};

module.exports = init;
