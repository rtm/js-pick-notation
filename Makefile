%.js: %.sjs
	@echo "import * as P from '..';" > $@
	@cat lib/pick.sjs $< | node_modules/.bin/sjs --stdin >> $@
