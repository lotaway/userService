const {createBundleRenderer} = require('vue-server-renderer')
    // , createApp = require('/path/to/built-server-bundle.js')
    , serverBundle = require('/path/to/vue-ssr-server-bundle.json')
    , Koa = require("koa")
;

const server = new Koa();
const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template: require("fs").readFileSync("./index.template.html", "utf-8"), // （可选）页面模板
    // clientManifest // （可选）客户端构建 manifest
});

server.use(async ctx => {
    const context = {
            pageTitle: "这是页面标题",
            url: ctx.req.url
        }
    ;

    // createApp(context).then(app => {
    // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
    // 现在我们的服务器与应用程序已经解耦！
    renderer.renderToString(/*app, */context, (err, html) => {
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
    // });
});

server.listen(3000);