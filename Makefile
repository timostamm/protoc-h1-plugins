
version = 1.3.5

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

