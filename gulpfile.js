// 載入 package
var gulp = require('gulp-help')(require('gulp'));   // 附加上 gulp-help，可以知道有哪些任務指令已存在
var browserSync = require('browser-sync').create(); // 瀏覽器同步檢視
var uglify = require('gulp-uglify');                // 壓縮 js
var cleanCSS = require('gulp-clean-css');           // 壓縮 css
var imageMin = require('gulp-imagemin');            // 壓縮 image
var useref = require('gulp-useref');                // 用來解析 html 註解標籤，用於合併檔案與 html 中所引入的檔案修改
var del = require('del');                           // 完整刪除資料夾與檔案
var gulpIf = require('gulp-if');                    // 可以針對指定的檔案提出作其他操作
var debug = require('gulp-debug');                  // 檢測任務執行的內容順序
var cached = require('gulp-cached');                // cached 使任務內的檔案不重複使用，可防止浪費時間再產生檔案

var root = {
    srcPath: 'src',
    destPath: 'dist',
};

var src = {
    htmlPath: root.srcPath + '/*.html',
    scriptPath: root.srcPath + '/js/*.js',
    stylePath: root.srcPath + '/css/*.css',
    imagePath: root.srcPath + '/images/**',
};

var dest = {
    htmlPath: root.destPath + '/',
    scriptPath: root.destPath + '/js',
    stylePath: root.destPath + '/css',
    imagePath: root.destPath + '/images',
};

gulp.task('server', function () {
    // 瀏覽器檢視同步的資料夾
    browserSync.init({
        server: root.srcPath
    });

    // 檔案有更動時同步更新 reload
    gulp.watch(root.srcPath + '/**').on('change', browserSync.reload);
});

// 完整刪除 dist 資料夾
gulp.task('clean', function () {
    return del(root.destPath);
});

// 將 image 最小化
gulp.task('image', function () {
    return gulp.src(src.imagePath)
            .pipe(imageMin())
            .pipe(gulp.dest(dest.imagePath));
});

gulp.task('main', function () {
    /**
     * 此為 js 的標記專用
     * 給 useref 插件的自定義參數，使用在 html 內所標記的內容
     * 使指定內容的檔案可以直接搬運到目的地的資料夾(dist)，路徑可以統一改變到同一個資料夾下
     *
     * @param {string} content html 內所標記的內容字串
     * @param {string} target 搬運到目的地的主要路徑
     * @return {string} 最後處理完成(改變路徑)後的內容字串
     */
    var useref_jsDirectlyMove = function(content, target) {
        // 取得 src="xxx" 的字串，如果配對不到就會回傳 null
        var filePath = content.match(/src=(\'|\").*?(\'|\")/g);
        // 預防消除 null
        filePath = filePath || [];

        for (var i in filePath) {
            // 取得路徑 xxx
            filePath[i] = filePath[i].slice(5, -1);

            // 如果是空值就消除內容
            if(filePath[i].length === 0) {
                delete filePath[i];
                continue;
            }

            // 替換原本 content 裡的 scr 或 href 路徑內容
            content = content.replace(filePath[i], target + '/' + (filePath[i].match(/[^\/]*$/g))[0] );
            // 加上完整路徑
            filePath[i] = root.srcPath + '/' + filePath[i];
        }

        // 搬運檔案到目的地資料夾，cached 避免重複搬運檔案
        gulp.src(filePath)
            .pipe(cached('jsDirectlyMove-task'))
            .pipe(gulp.dest(root.destPath + '/' + target))
            .pipe(debug({title: 'js directly moved file: '}));

        return content.trim();
    };

    /**
     * 此為 css 的標記專用，與上面函式式類似的功能
     *
     * @param {string} content html 內所標記的內容字串
     * @param {string} target 搬運到目的地的主要路徑
     * @return {string} 最後處理完成(改變路徑)後的內容字串
     */
    var useref_cssDirectlyMove = function(content, target) {
        var filePath = content.match(/href=(\'|\").*?(\'|\")/g);
        filePath = filePath || [];

        for (var i in filePath) {
            filePath[i] = filePath[i].slice(6, -1);

            if(filePath[i].length === 0) {
                delete filePath[i];
                continue;
            }
            content = content.replace(filePath[i], target + '/' + (filePath[i].match(/[^\/]*$/g))[0] );
            filePath[i] = root.srcPath + '/' + filePath[i];
        }

        gulp.src(filePath)
            .pipe(cached('cssDirectlyMove-task'))
            .pipe(gulp.dest(root.destPath + '/' + target))
            .pipe(debug({title: 'css directly moved file: '}));

        return content.trim();
    };

    // 取得 html 裡的標記內容來進行檔案的搬運、合併、壓縮 css 與 js，加入自訂義的參數
    return gulp.src(src.htmlPath)
            .pipe(useref({
                jsDirectlyMove: useref_jsDirectlyMove,
                cssDirectlyMove: useref_cssDirectlyMove
            }))
            .pipe(cached('main-task'))
            .pipe(gulpIf('*.js', uglify()))
            .pipe(gulpIf('*.css', cleanCSS({compatibility:'ie8'})))
            .pipe(gulp.dest(root.destPath))
            .pipe(debug({title: 'Generated file: '}));
});

/**
 * 主要使用的任務類型 :
 * gulp
 * gulp build
 */
gulp.task('default', ['server']);
gulp.task('build', ['main', 'image']);
