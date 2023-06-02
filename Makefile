
build: download compile

compile:
	yarn run build && hugo -b https://master--zubr-cc.netlify.app/

download:
	curl https://graph.zubr.app/courts/ --output content.zip && unzip -o content.zip
