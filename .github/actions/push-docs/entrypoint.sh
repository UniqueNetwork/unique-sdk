#!/bin/sh -l

DST_OWNER=$INPUT_DST_OWNER
DST_REPO=$INPUT_DST_REPO
DST_BRANCH=$INPUT_DST_BRANCH
DST_PATH=$INPUT_DST_PATH
SRC_PATH=$INPUT_SRC_PATH
PR_BRANCH=$INPUT_PR_BRANCH

apk add jq

COMMIT_EMAIL=$(jq '.pusher.email' $GITHUB_EVENT_PATH)
COMMIT_NAME=$(jq '.pusher.name' $GITHUB_EVENT_PATH)

git config --global user.email $COMMIT_EMAIL
git config --global user.name $COMMIT_NAME

DST_REPO_PATH="https://$GITHUB_TOKEN@github.com/$DST_OWNER/$DST_REPO.git"

cd $GITHUB_WORKSPACE

git clone $DST_REPO_PATH

cd $DST_REPO

git checkout -b $PR_BRANCH

mkdir -p $GITHUB_WORKSPACE/$DST_REPO/$DST_PATH

cd $GITHUB_WORKSPACE/$SRC_PATH

cp -R * $GITHUB_WORKSPACE/$DST_REPO/$DST_PATH

cd $GITHUB_WORKSPACE/$DST_REPO

git add .
git commit -m "Generate docs from SDK"

git push $DST_REPO_PATH $PR_BRANCH

gh pr create --fill --base $DST_BRANCH --head $PR_BRANCH
