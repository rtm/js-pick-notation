%.js: %.sjs
	echo "import * as P from '..';" > $@
	cat lib/pick.sjs $< | sjs --num-expands 1 --stdin >> $@
