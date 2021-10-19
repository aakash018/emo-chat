#!/bin/bash

echo Write a commit message?
read MESSAGE


git add .
git commit -m "$MESSAGE"
git push origin main
git subtree push --prefix server heroku master