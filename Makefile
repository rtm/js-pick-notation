%.js: %.sjs
	@echo "import * as P from '..';" > $@
	node_modules/.bin/sjs -m ./lib/pick.sjs $< >> $@
