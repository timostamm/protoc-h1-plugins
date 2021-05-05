
version = 1.3.15
plugin_path = src

release: git-tag npm-publish

npm-publish:
	npm publish

git-tag:
	# update package.json
	@sed  's|"version.*$$|"version": "$(version)",|' package.json > package.json.tmp
	@mv package.json.tmp package.json

	# add version tag
	@git fetch
	@git rev-parse "v$(version)" >/dev/null 2>&1 && { echo "git tag v$(version) already exists"; exit 1; } || :;
	git tag -a "v$(version)" -m "Version $(version)"

	# push
	git commit --all --edit
	git push origin --tags
	git push origin --all


examples: example_php_server example_angular_client example_dotnet_client

example_php_server:
	@find example/out-php ! -path example/out-php ! -name '.gitignore' -exec rm -rf {} +
	protoc --proto_path=example/protos \
    	--php_out=example/out-php \
    	example/protos/*.proto

example_dotnet_client:
	@find example/out-csharp ! -path example/out-csharp ! -name '.gitignore' -exec rm -rf {} +
	protoc --proto_path=example/protos \
		--plugin=$(plugin_path)/protoc-gen-h1c-dotnetcore \
		--h1c-dotnetcore_out=example/out-csharp \
		--csharp_opt=base_namespace= \
		--csharp_out=example/out-csharp \
		--csharp_opt=base_namespace= \
		example/protos/*.proto

example_dotnet_interface:
	@find example/out-csharp ! -path example/out-csharp ! -name '.gitignore' -exec rm -rf {} +
	protoc --proto_path=example/protos \
		--plugin=$(plugin_path)/protoc-gen-h1c-dotnetinterface \
		--h1c-dotnetinterface_out=example/out-csharp \
		--csharp_opt=base_namespace= \
		--csharp_out=example/out-csharp \
		--csharp_opt=base_namespace= \
		example/protos/*.proto

example_angular_client:
	@find example/out-angular ! -path example/out-angular ! -name '.gitignore' -exec rm -rf {} +
	protoc --proto_path=example/protos \
		--plugin=$(plugin_path)/protoc-gen-h1c-angular \
		--h1c-angular_out=example/out-angular \
		example/protos/*.proto
