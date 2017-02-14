all:
	NODE_ENV=development npm run build

build:
	mkdir -p ./build/src && \
	cp -f ./bin/buildsrc/* ./build/ && \
	tsc --outDir ./build/ --watch false && \
	cd ./build && make

start:
	export NODE_ENV=local && node ./node_modules/concurrently/src/main.js --kill-others "docker-compose up" "npm start"

seed:
	serverless dynamodb execute -n users
	serverless dynamodb execute -n queries

migrate-dev:
	serverless dynamodb executeAll

deploy:
	npm run deploy

#endpoints:
#POST - https://9276kvu81j.execute-api.ap-northeast-1.amazonaws.com/dev/graphql
#functions:
#sc-service-v2-dev-api: arn:aws:lambda:ap-northeast-1:447050364325:function:sc-service-v2-dev-api
#GRAPHQL_ENDPOINT = https://jryu0pksc4.execute-api.ap-northeast-1.amazonaws.com/dev/graphql

req:
	curl -X POST "http://localhost:3000/graphql" -H "content-type: application/json" --data-binary '{"query":"query($$var: String!) { user(id: $$var) { id name email }}","variables":{"var":"1"}}'

req-dev:
	curl -X POST "https://5krq1xeu4d.execute-api.ap-northeast-1.amazonaws.com/dev/graphql" -H "content-type: application/json" --data-binary '{"query":"query { viewer { id name email token screenName permissions }}","variables":{}}'
	#curl -X POST "https://9276kvu81j.execute-api.ap-northeast-1.amazonaws.com/dev/graphql" -H "content-type: application/json" --data-binary '{"query":"query { viewer { id name email token screenName permissions }}","variables":{}}'

req-l:
	docker run --link dynamodb --net serverless_default -v $(PWD)/build:/var/task lambci/lambda handler.graphql '{"body": "{\"query\":\"query { viewer { id email name screenName }}\",\"variables\":{}}"}' && \
	echo ''

req-ll:
	export DOCKER_ENV=lambci && \
	export NODE_ENV=local && \
	touch ./bin/genconfig.js && \
	npm run build && \
	docker run --link dynamodb --net serverless_default -v $(PWD)/build:/var/task lambci/lambda handler.graphql '{"body": "{\"query\":\"query { viewer { id email name screenName }}\",\"variables\":{}}"}' && \
	echo ''

cli:
	NODE_ENV=local ./bin/dynamo-repl

cli-dev:
	NODE_ENV=developpment ./bin/dynamo-repl

logs:
	cd build && make logs

.PHONY: build
