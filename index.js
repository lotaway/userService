// 第 1 步：创建一个 Vue 实例
const Vue = require('vue')
    , Koa = require("koa")
;

const app = new Koa()
    , vue = new Vue({
    template: `<div>Hello World</div>`
});
// 第 2 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer({
    template: require("fs").readFileSync("./index.template.html", "utf-8")
});
// 第 3 步：将 Vue 实例渲染为 HTML

app.use(async ctx => {
    const context = {
        pageTitle: "这是页面标题"
    };
    renderer.renderToString(vue, context, (err, html) => {
        if (err) {
            throw err;
        }
        ctx.body = html;
        // console.log(html);
        // => <div data-server-rendered="true">Hello World</div>
    });
});

app.listen(3000);