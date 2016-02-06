%.js: %.sjs
	@echo "import {pick, pickOne} from '..';" > $@
	@cat lib/pick.sjs $< | sjs --stdin >> $@
