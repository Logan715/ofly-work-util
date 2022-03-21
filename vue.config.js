const apiMocker = require("mocker-api");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
let { version } = require("./package.json");

function addStyleResource(rule) {
    rule.use('style-resource')
      .loader('style-resources-loader')
      .options({
      // 需要引入的公共文件
        patterns: [
          path.resolve(__dirname, './src/assets/theme/variable.less'),
        ]
      })
    }

module.exports = {
    //Solution For Issue:You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.
    //zhengkai.blog.csdn.net
    publicPath: "./",
    runtimeCompiler: true,
    filenameHashing: false,
    pages: {
        index: {
             // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            title: 'Ofly工作工具',
        }
    },
    devServer: {
        port: 8002,
    },

    chainWebpack: config => {
        // 修复HMR
        config.resolve.symlinks(true);
        // 去除h5预加载
        config.plugins.delete("prefetch");
        // 别名配置
        config.resolve.alias.set("@", path.resolve(__dirname, "./src"));
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            config.mode = "production";
            let optimization = {
                minimize: true,
                minimizer: [new TerserPlugin()]
            };
            config.optimization = optimization;
            config.output = {
                ...config.output,
                filename: `static/js/[name].[contenthash:8].${version}.js`,
                chunkFilename: `static/js/[name].[contenthash:8].${version}.js`
            };
        } else {
        }
    }
};
