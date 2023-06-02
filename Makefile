
build: download compile

compile:
	yarn run build && hugo

download:
	curl https://graph.zubr.app/courts/ --output content.zip && unzip -o content.zip
