#Table of Contents

* [Developer setup](#developer-setup)
* [Setup for AWS](#setup-for-aws)
* [Install NodeJS and dependencies](#install-nodejs-and-dependencies)
* [Install MySQL 8 (and optionally SQLite)](#install-mysql-8-and-optionally-sqlite)
* [Setup MySQL DB](#setup-mysql-db)
* [Setup Gitlab for cloning code into AWS Instance](#setup-gitlab-for-cloning-code-into-aws-instance)
* [Install NPM dependencies](#install-npm-dependencies)
* [Setup Subdomain config files](#setup-subdomain-config-files)
* [Setup the DB with seed data](#setup-the-db-with-seed-data)
* [Start the server](#start-the-server)

## Developer setup
Refer to the file doc/dev_setup.md for a list of cURL commands.

 
### Setup for AWS

copy the private key .pem file into ~/.ssh
```bash
$ mv ~/Downloads/ebpApp.pem ~/.ssh/
```

Change permissions to make private key secure
```bash
$ chmod 600 ~/.ssh/ebaApp.pem
```

Now try to open an SSH session
```bash
$ ssh -i ~/.ssh/ebpApp.pem ubuntu@13.234.213.178
```

Ravi's AWS Instance: 
```bash
$ ssh -i ~/.ssh/ebpApp.pem ubuntu@13.234.213.178
```

### Install NodeJS and dependencies
```bash
$ ssh -i ~/.ssh/ebpApp.pem ubuntu@13.234.213.178
$ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ node -v # should show v12.16.3 or more
$ npm -v # should show 6.14.4 or more
$ sudo apt install make gcc g++
```

### Install MySQL 8 (and optionally SQLite)
```bash
$ cd /tmp
$ sudo curl -OL https://dev.mysql.com/get/mysql-apt-config_0.8.15-1_all.deb
$ sudo dpkg -i mysql-apt-config*
    Select MySQL Server & Cluster (Currently selected: mysql-8.0)
    Select mysql-8.0
$ sudo apt update
$ sudo rm mysql-apt-config*
$ sudo apt install -y mysql-server
    Set root password to "ebAppRoot1$"
    Choose "Use Legacy Authentication Method (Retain MySQL 5.x Compatibility)"
$ sudo mysql_secure_installation
    Set root password to STRONG and the root password is "ebAppRoot1$"
    Remove anonymous users? (Press y|Y for Yes, any other key for No) : y
    Disallow root login remotely? (Press y|Y for Yes, any other key for No) : y
    Remove test database and access to it? (Press y|Y for Yes, any other key for No) : n
    Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y
$ mysql --version
    Must show "mysql  Ver 8.0.20 for Linux on x86_64 (MySQL Community Server - GPL)" or greater
```


### Setup MySQL DB
```bash
$ sudo mysql -u root
    mysql> CREATE DATABASE IF NOT EXISTS eb_app_db_staging;
    mysql> CREATE USER 'eb_app_user@localhost' IDENTIFIED BY 'ebAppUser1$';
    mysql> SHOW DATABASES;
    +--------------------+
    | Database           |
    +--------------------+
    | eb_app_db_staging  |
    +--------------------+

    mysql> GRANT ALL PRIVILEGES ON eb_app_db_staging.* TO 'eb_app_user'@'localhost';
    mysql> GRANT PROCESS ON *.* TO `eb_app_user`@`localhost`;
    mysql> FLUSH PRIVILEGES;
    mysql> quit
$ mysql -u eb_app_user -p -e 'SHOW DATABASES;'
    Enter password:
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | eb_app_db_staging  |
    +--------------------+
```

### setup Gitlab for cloning code into AWS Instance
```bash
$ ssh-keygen -t ed25519
$ cat /home/ubuntu/.ssh/id_ed25519.pub

# copy the key from terminal and add it in your Gitlab account (click on your profile > click on "SSH Keys" > paste copied public key in the text box > )
    
$ git clone git@gitlab.com:vvsanilkumar/employee_benefits.git
$ git checkout dev
```

### Install NPM dependencies
#### Install NPM module sqlite3 globally. This is needed for the server to run in "NODE_ENV=development" and "NODE_ENV=test".
```bash
$ sudo npm install sqlite3 -g --unsafe # This has to be done using "--unsafe" otherwise sqlite3 will not install globally.
```

#### Install NPM module apidocs globally. This is needed for generating REST API docs.
```bash
$ sudo npm install apidocs -g
```

#### Install all other dependencies locally
```bash
$ cd ~/employee_benefits/
$ npm install
```
### Setup Subdomain config files
Create configuration files (in folder *config*) to store subdomain information for each NODE_ENV value  as below:

| NODE_ENV | Subdomain config file name |
| -------- | --------- |
| production | config/subdomains.prod.json |
| staging | config/subdomains.staging.json |
| test | config/subdomains.test.json |
| development | config/subdomains.development.json |

*PLEASE NOTE:* All subdomains.*.json config files listed above should be initialized. Else, the server will not start.

Fill up the file with one mandatory entry as below:
```json
{
  "defaultSubdomain":"www.visista4u",
  "subdomains": [
    {
        "subdomain": "www.visista4u",
        "corporateName": "Visista Insurance Broking Services Pvt Ltd",
        "brokingCompanyName": "Visista Insurance Broking Services Pvt Ltd"
    }
  ]
}
```

*"defaultSubdomain"* should be set as per the URL that will be used to access the server in admin/executive role. For example, if https://www.visista4u.com is used for executive/managerlogin then it should be set like so: 
```json
{
  "defaultSubdomain": "www.visista4u"
}
```
If https://www.awesomeService.com is used for executive/managerlogin then it should be set as below:
```json
{
  "defaultSubdomain": "www.awesomeService"
}
```


### Setup .env file
The server needs username,password,and subdomain to perform user authentication. The supported subdomains for each NODE_ENV environment are present in the folder in the form _/config/subdomains.xxx.json_

The path to these files must be provided in a _.env_ file and stored in the root folder of the app. Below is a sample _.env_ file. 

Delete the lines for the environments you do not need and change the file path as needed to point to the correct _/config/subdomains.xxx.json_ file.

```bash
DEVELOPMENT_SUBDOMAIN_CONFIG_FILE=/path/to/employee_benefits/config/subdomains.development.json
TEST_SUBDOMAIN_CONFIG_FILE=/path/to/employee_benefits/config/subdomains.test.json
STAGING_SUBDOMAIN_CONFIG_FILE=/path/to/employee_benefits/config/subdomains.staging.json
PRODUCTION_SUBDOMAIN_CONFIG_FILE=/path/to/employee_benefits/config/subdomains.prod.json
```

### Setup the DB with seed data
Follow the instructions provided in _doc/frequently_used_commands.md_. Refer to the question _Setup mock Prod DB in staging - Instructions_.

To verify if DB is setup properly run the below command and you should see the tables listed as below:

```bash
$  mysql -u eb_app_user -p -e 'SHOW TABLES;' eb_app_db_dev
Enter password: 
+------------------------------------------+
| Tables_in_eb_app_db_dev                  |
+------------------------------------------+
| Ailments                                 |
| BrokingCompanies                         |
| Claims                                   |
| CorporateHRs                             |
| Corporates                               |
| CustomerJournals                         |
| CustomerStateJournals                    |
| Customers                                |
| DependentStateJournals                   |
| Dependents                               |
| EmployeeGrievances                       |
| ExecutiveCorporateMappings               |
| Executives                               |
| FamilyDefinitions                        |
| InsuranceCompanies                       |
| InsuranceEnquiries                       |
| NetworkHospitals                         |
| NonNetworkHospitals                      |
| Policies                                 |
| PolicyAilmentMappings                    |
| PolicyCongenitalAilmentsExternalMappings |
| PolicyCongenitalAilmentsInternalMappings |
| SequelizeMeta                            |
| TPAs                                     |
| Users                                    |
+------------------------------------------+
```

### Start the server
#### In local dev environments
```bash
$ cd employee_benefits/
$ npm run dev     // <-- For development
$ npm run test    // <-- For running tests
$ npm run start   // <-- For production runs
```

#### On Ravi's AWS instance
```bash
$ ssh -i ~/.ssh/ebpApp.pem ubuntu@13.234.213.178
$ sudo -i
$ cd my-site/employee_benefits/
$ ./start_eb_app.sh
```

### To run tests
```bash
$ npm run test
```

### To run in perpetual dev mode(nodemon)
```bash
$ npm run dev
```
