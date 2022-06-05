# Frequently Used Commands

* [Setup Prod DB - Instructions](#setup-prod-db---instructions)
* [To create a Sequelize migration file](#to-create-a-sequelize-migration-file)
* [To create a Sequelize seeder file](#to-create-a-sequelize-seeder-file)
* [Run all migrations and seeders UP](#run-all-migrations-and-seeders-up)
* [Run all migrations and seeders DOWN](#run-all-migrations-and-seeders-down)
* [Run CRON job for policy approval](#run-cron-job-for-policy-approval)

### Setup Prod DB - Instructions
- Login into AWS account as usual
- Pull latest dev branch as usual. NOTE: Seeder files for production are placed in folder seeders/production/
- Now enter these instructions to reseed db with starting prod data
```bash
$ NODE_ENV=production npx sequelize-cli db:seed:undo:all --seeders-path=seeders/production
$ NODE_ENV=production npx sequelize-cli db:migrate:undo:all
$ NODE_ENV=production npx sequelize-cli db:migrate
$ NODE_ENV=production npx sequelize-cli db:seed:all --seeders-path=seeders/production
```
- Start UI as usual in browser. Login with username "admin". Password for login is present in seeder file source code.


### To create a Sequelize migration file
```bash
 $ npx sequelize-cli model:generate --name Executive --attributes uuid:uuid,empid:string,firstName:string,lastName:string,email:string,mobile:string,brokingCompanyUuid:uuid,supervisorEmpid:string,active:{type:boolean, allowNull:false,defaultValue: true}
```

### To create a Sequelize seeder file
```bash
$ npx sequelize-cli seed:generate --name seedBrokingCompanies
```

### Run all migrations and seeders UP
```bash
$ npx --env development sequelize-cli db:migrate && npx --env development sequelize-cli db:seed:all
```

### Run all migrations and seeders DOWN
```bash
$ npx --env development sequelize-cli db:seed:undo:all && npx --env development sequelize-cli db:migrate:undo:all
```

### Run CRON job for policy approval
To fire the cron job in prod instance, open a browser or Postman or cURL and fire this REST API.
```HTML
http://ec2-13-234-41-234.ap-south-1.compute.amazonaws.com/api/v1/dashboard/cron/trigger?token=nwry3GTye3&jobName=policy_approval_cron
```

