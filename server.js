const createApp = require('/path/to/built-server-bundle.js')
    , Koa = require("koa")
;

const server = new Koa();
const renderer = require('vue-server-renderer').createRenderer({
    template: require("fs").readFileSync("./index.template.html", "utf-8")
});

server.use(async ctx => {
    const context = {
            pageTitle: "这是页面标题",
            url: ctx.req.url
        }
    ;

    createApp(context).then(app => {
        renderer.renderToString(app, context, (err, html) => {
            if (err) {
                if (err.code === 404) {
                    ctx.res.status(404).end('Page not found')
                } else {
                    ctx.res.status(500).end('Internal Server Error')
                }
            }
            ctx.body = html;
            // console.log(html);
            // => <div data-server-rendered="true">Hello World</div>
            // ctx.res.end;
        });
    });
});

server.listen(3000);