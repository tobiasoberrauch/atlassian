sudo docker pull zaiste/postgresql
sudo docker run -d --name postgres -p=5432:5432 zaiste/postgresql

cd "$(dirname $0)"
cat initialise_db.sh | sudo docker run --rm -i --link postgres:db zaiste/postgresql bash -

sudo docker build -t durdn/stash-2.9.1 stash

sudo docker run -d --name stash --link postgres:db -p 7990:7990 durdn/stash-2.9.1

sudo docker build -t durdn/jira-6.1.1 jira

sudo docker run -d --name jira --link postgres:db --link stash:stash -p 8080:8080 durdn/jira-6.1.1

echo "Containers running..."
sudo docker ps

echo "IP Addresses of containers:"
sudo docker inspect -f '{{ .Config.Hostname }} {{ .Config.Image }} {{ .NetworkSettings.IPAddress }}' postgres stash jira
