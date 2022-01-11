let preprocessor = 'sass' 

//Gulp
import pkg from 'gulp';
const { src, dest, series, parallel, watch } = pkg;
//browser-sync
import browserSync    from 'browser-sync'
//Webpack
import webpackStream  from 'webpack-stream'
import Webpack 		  	from 'webpack'
import TerserPlugin   from 'terser-webpack-plugin'
//(PostCss) и его плагины
import PostCss    	  from 'gulp-postcss'
import cssnano 		  	from 'cssnano'
import autoprefixer   from 'autoprefixer'
//Sass 
import dartSass       from 'sass'
import gulpSass       from 'gulp-sass'
const  sass = gulpSass(dartSass)
import sassglob       from 'gulp-sass-glob'
//images
import newer 					from 'gulp-newer'
import imagemin 			from 'gulp-imagemin'
//Удаление
import del            from 'del'
//Объединение файлов
import concat 		  from 'gulp-concat'


function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/',
		},
		ghostMode: { clicks: false },
		notify: false,
		online: true,
		// tunnel: 'sitename', // Attempt to use the URL "http://sitename.localtunnel.me"
	})
}

function scripts() {
	return src(['app/js/*.js', '!app/js/*.min.js'])
	.pipe(webpackStream({
		mode: 'production', //Предоставление параметра конфигурации указывает веб-пакету, что необходимо соответствующим образом использовать встроенные оптимизации.
		performance: { hints: false }, //Отключает настройки отображения подсказок по производительности.
		module: {
			rules: [ //правила по которым мы компилируем определенный вид файла с определенным расширением.
				{		  
					test: /\.m?js$/, //влияет на то какой файл какого расширения мы возьмем 
					exclude: /node_modules/, //выбираем файлы которые мы не хотим включать в конвертацию
					use: {
						loader: 'babel-loader', // "babel-loader"//это адаптер между webpack и babel
						options: {
							presets: ['@babel/preset-env'],
							plugins: ['babel-plugin-root-import']
						} 
					}
				}
			]
		},
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: { 
						format: { comments: false },
						compress: true, 
					},
					extractComments: false,
				}),
			],
		},
	})).on('error', function handleError() { 
		this.emit('end')
	})  
	.pipe(concat('app.min.js'))
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
}

function styles() {
	return src([`app/styles/${preprocessor}/*.*`, `!app/styles/${preprocessor}/_*.*`])
	.pipe(eval(`${preprocessor}glob`)())
	.pipe(eval(preprocessor)())
	.pipe(PostCss([
		autoprefixer({ grid: 'autoplace' }),
		cssnano({ preset: ['default', { discardComments: {removeAll: true} }] })
	]))
	.pipe(concat('app.min.css'))
	.pipe(dest('app/css'))
	.pipe(browserSync.stream())
}

function images() {
	return src('app/images/src/**/*')
	.pipe(newer('app/images/dist/**/*'))
	.pipe(imagemin())
	.pipe(dest('app/images/dist'))
	.pipe(browserSync.stream())
}

function startwatch() {
	watch(['app/js/**/*.js', '!app/js/**/*.min.js'], scripts)
	watch(`app/styles/${preprocessor}/**/*`, styles)
	watch('app/images/src/**/*', images)
	watch('app/**/*.html').on('change', browserSync.reload)
}

function buildcopy() {
	return src([
		'app/js/**/*.min.js',
		'app/css/*.min.css',
		'app/images/**/*.*',
		'!app/images/src/**/*',
		'app/**/*.html',
		'app/fonts/**/*'
	], { base: 'app/' })
	.pipe(dest('dist/'))
}

function cleandist() {
  return del('dist/**/*', { force: true })
}

export {scripts, styles, images}
export let build  =  series(cleandist, scripts, styles, images, buildcopy) 
export default  series(scripts, styles, images, parallel(browsersync, startwatch))