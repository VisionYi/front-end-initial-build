# Front End Initial Build

這是前端開發流程的初期建置，也可以算是個初期樣板，包含了 Gulp 的使用開發。
</br>
在我的 Blog 中有我的學習開發建置的筆記 : [學習前端工作流程 - 初期開發建置](https://visionyi.github.io/2017/05/28/%E5%AD%B8%E7%BF%92%E5%89%8D%E7%AB%AF%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B-%E5%88%9D%E6%9C%9F%E9%96%8B%E7%99%BC%E5%BB%BA%E7%BD%AE/)

## Content
主要任務管理功能有:
- 啟動 server，根目錄為 src，會監看 src 原始碼目錄裡的檔案有更動時會自動重新刷新瀏覽器
- 建置檔案，可以產生正式目錄檔案(dist)
- 清除正式目錄檔案(dist)

有使用到以下工具 :
- Node.js / NPM
- Bower
- Gulp
- Git & Github

## Usage

開始前需先安裝 Node.js 環境。

下載資源程式碼 & 進入專案 :
```shell
$ git clone https://github.com/kdchang/front-end-initial-build
$ cd front-end-initial-build
```

初始化 :
```shell
$ npm install && bower install
```

開始啟動專案 server 與任務管理器 :
```shell
$ npm start      # 或 npm run start 或 gulp
```

建置產生正式目錄檔案(dist) :
```shell
$ npm run build  # 或 gulp build
```

清除正式目錄檔案(dist) :
```shell
$ npm run clean  # 或 gulp clean
```

### Use with basic gulpfile.js
因為本專案用的 gulpfile.js 的程式碼為較進階版的，也有參入自訂義元素，所以這裡也放上基本版的。功能與上面的使用方式相同，只有啟動 server 後的根目錄改為 dist 正式目錄。

基本版的 gulpfile.js 之程式碼 :
```javascript
// 載入 package
var gulp = require('gulp-help')(require('gulp'));   // 附加上 gulp-help，可以知道有哪些任務指令已存在
var browserSync = require('browser-sync').create(); // 瀏覽器同步檢視
var uglify = require('gulp-uglify');                // 壓縮 js
var cleanCSS = require('gulp-clean-css');           // 壓縮 css
var imageMin = require('gulp-imagemin');            // 壓縮 image
var concat = require('gulp-concat');                // 合併檔案
var useref = require('gulp-useref');                // 用來解析 html 註解標籤，用於合併檔案與 html 中所引入的檔案修改
var del = require('del');                           // 完整刪除資料夾與檔案

gulp.task('server', function () {
    // 瀏覽器檢視同步的資料夾
    browserSync.init({
        server: 'dist'
    });
});

// 完整刪除 dist 資料夾
gulp.task('clean', function () {
    return del('dist');
});

gulp.task('script', function () {
    return gulp.src('src/js/*.js')                  // 所有要壓縮的 .js 檔案
            .pipe(uglify())                         // 將 JavaScript 最小化
            .pipe(concat('main.min.js'))            // 將所有 js 合併成 main.min.js
            .pipe(gulp.dest('dist/js'))             // 壓縮後檔案輸出位置
            .pipe(browserSync.stream());            // 瀏覽器檢視同步更新
});

gulp.task('style', function() {
    return gulp.src('src/css/*.css')                // 所有要壓縮的 .css 檔案
            .pipe(cleanCSS({compatibility:'ie8'}))  // 將 css 最小化
            .pipe(concat('main.min.css'))           // 將所有 css 合併成 main.min.css
            .pipe(gulp.dest('dist/css'))            // 壓縮後檔案輸出位置
            .pipe(browserSync.stream());            // 瀏覽器檢視同步更新
});

gulp.task('html', function () {
    return gulp.src('src/*.html')
            .pipe(useref({                          // 只有對 html 做操作而已，合併並修改 html 上有標記的地方
                noAssets: true
            }))
            .pipe(gulp.dest('dist'))
            .pipe(browserSync.stream());
});

gulp.task('image', function () {
    return gulp.src('src/images/**')
            .pipe(imageMin())                       // 將 image 最小化
            .pipe(gulp.dest('dist/images'))
            .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['script']);          //監看所有 js 檔案，檔案有更動時就執行 task script
    gulp.watch('src/css/*.css', ['style']);         //監看所有 css 檔案，檔案有更動時就執行 task style
    gulp.watch('src/*.html', ['html']);             //監看所有 html 檔案，檔案有更動時就執行 task html
    gulp.watch('src/images/**/*', ['image']);       //監看所有 image 檔案，檔案有更動時就執行 task image
});

/**
 * 主要使用的任務類型 :
 * gulp
 * gulp build
 */
gulp.task('default', ['script', 'style', 'html', 'image', 'server', 'watch']);
gulp.task('build', ['html', 'style', 'script', 'image']);

```

也需要把 src/index.html 檔案裡的以下程式碼刪除，這是進階版才能使用的 :

```html
<!-- build:jsDirectlyMove lib/js -->
<script type="text/javascript" src="lib/jquery/dist/jquery.min.js"></script>
<!-- endbuild -->
```

## License
MIT
