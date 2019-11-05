
version = 1.3.2

release: git-tag npm-publish

npm-publish:
	npm publish

git-tag:
	@git fetch
	@git rev-parse "v$(version)" >/dev/null 2>&1 && { echo "git tag v$(version) already exists"; exit 1; } || :;
	git tag -a "v$(version)" -m "Version $(version)"
	git commit --all --edit
	git push origin --all

