%.js: %.sjs
	echo "import {pick, pickOne} from './runtime';" > $@
	cat pick.sjs $< | sjs --stdin >> $@
