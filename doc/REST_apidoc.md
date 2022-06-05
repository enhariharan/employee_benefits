# REST API Documentation in EB Server

This server uses [apiDoc](https://www.npmjs.com/package/apidoc) to create REST API documentation.

## How can I install apidoc?
Install apidoc globally using NPM package manager.
```shell script
~/employee_benefits$ npm install -g apidoc
```

## Which files have apidoc comments?
- apidoc comments can be found in the files in the folder **routes/**
- Only the routes files have apidoc comments to explain the REST API.

## How can I generate REST API docs from source files?
- Open terminal and type the following commands.
```shell script
~/employee_benefits$ cd ~/employee_benefits
~/employee_benefits$ apidoc -i routes/ -o doc/apidoc/
```

## How can I read the documentation?
If the documentation generation was successful then you should see the following folder structure in folder doc/apidoc/.
```shell script
~/employee_benefits$ ls -l ./doc/apidoc/
total 352
-rw-rw-r-- 1 hariharan hariharan 102975 Jul 11 08:27 api_data.js
-rw-rw-r-- 1 hariharan hariharan 102955 Jul 11 08:27 api_data.json
-rw-rw-r-- 1 hariharan hariharan    437 Jul 11 08:27 api_project.js
-rw-rw-r-- 1 hariharan hariharan    428 Jul 11 08:27 api_project.json
drwxr-xr-x 2 hariharan hariharan   4096 Jul 11 08:27 css
drwxr-xr-x 2 hariharan hariharan   4096 Jul 11 08:27 fonts
drwxr-xr-x 2 hariharan hariharan   4096 Jul 11 08:27 img
-rw-r--r-- 1 hariharan hariharan  29304 Jul 11 08:27 index.html
drwxr-xr-x 2 hariharan hariharan   4096 Jul 11 08:27 locales
-rw-r--r-- 1 hariharan hariharan  32631 Jul 11 08:27 main.js
drwxr-xr-x 2 hariharan hariharan   4096 Jul 11 08:27 utils
drwxr-xr-x 4 hariharan hariharan   4096 Jul 11 08:27 vendor
```

Open the file index.html in your favorite browser to read the documentation.
```shell script
~/employee_benefits$ firefox ./doc/apidoc/index.html &
```
