NODE_ENV=staging npx sequelize-cli db:migrate:undo:all && NODE_ENV=staging npx sequelize-cli db:migrate && NODE_ENV=staging npx sequelize-cli db:seed:undo:all && NODE_ENV=staging npx sequelize-cli db:seed:all
echo "Done migrating and seeding DB"
echo "Now going to pull NetworkHospitals from FHPL SOAP server"
curl --header "Content-Type: application/json" --request POST 'http://localhost/api/v1/networkHospitals?startIndex=1&endIndex=2000&insuranceCompanyUuid=69a66da2-2d81-4e69-854d-3ab84421978b&tpaUuid=d7bf8d2e-0839-494d-a33f-69812737a8f7'
echo "Now going to pull Claims from FHPL SOAP server"
curl --header "Content-Type: application/json" --request GET 'http://localhost/api/v1/claims2?policy=556004501910000053&fromDate=2018-01-01&toDate=2020-07-31'
echo "All Done."
