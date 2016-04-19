uglify:
	rm -f sock.min.js
	uglifyjs input.js game.js -m -c -o sock.min.js
