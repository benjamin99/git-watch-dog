# git-watch-dog

the simple script to help setting/resetting the --assume-unchanged falg on specific files

## Install

`npm install -g git-watch-dog`

## Usage

### Setup the related git hook

`git-watch-dog init`

### Lock the specific file

`git-watch-dog lock <file>`

### Release the specific file

`git-watch-dog release <file>`

## TODOs

- support different lock list for different branches

