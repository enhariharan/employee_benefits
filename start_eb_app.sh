env=$1 # The environment
branch="" # The Git branch to checkout

if [ -z env ];
then
  branch="master"
  echo "Assuming Git branch to checkout to be master"
else
  case "${env:0:3}" in
  "dev")
    branch="dev"
    echo "Git branch to checkout is set to $branch"
    ;;

  "pro")
    branch="master"
    echo "Git branch to checkout is set to $branch"
    ;;

  "sta")
    branch="master"
    echo "Git branch to checkout is set to $branch"
    ;;

  *)
    branch="master"
    echo "Incorrect environment provided. Accepted values are (development|production|staging)."
    exit -1
    ;;

esac
fi

pushd ~/my-site/employee_benefits/
git checkout $branch && git fetch && git pull && git status

if ! command -v apidoc &> /dev/null
then
  echo "HTML documentation is not generated since apidoc was not found."
else
  apidoc -i routes/ -o doc/apidoc/
fi

forever stopall
~/startup.sh
forever list

popd