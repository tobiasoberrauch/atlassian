#!/bin/bash
set -o errexit

if [ -z "$STASH_HOME" ]; then
  export STASH_HOME=/opt/stash-home
fi

urldecode() {
    local data=${1//+/ }
    printf '%b' "${data//%/\x}"
}

parse_url() {
  local prefix=DATABASE
  [ -n "$2" ] && prefix=$2
  # extract the protocol
  local proto="`echo $1 | grep '://' | sed -e's,^\(.*://\).*,\1,g'`"
  local scheme="`echo $proto | sed -e 's,^\(.*\)://,\1,g'`"
  # remove the protocol
  local url=`echo $1 | sed -e s,$proto,,g`

  # extract the user and password (if any)
  local userpass="`echo $url | grep @ | cut -d@ -f1`"
  local pass=`echo $userpass | grep : | cut -d: -f2`
  if [ -n "$pass" ]; then
    local user=`echo $userpass | grep : | cut -d: -f1`
  else
    local user=$userpass
  fi

  # extract the host -- updated
  local hostport=`echo $url | sed -e s,$userpass@,,g | cut -d/ -f1`
  local port=`echo $hostport | grep : | cut -d: -f2`
  if [ -n "$port" ]; then
    local host=`echo $hostport | grep : | cut -d: -f1`
  else
    local host=$hostport
  fi

  # extract the path (if any)
  local full_path="`echo $url | grep / | cut -d/ -f2-`"
  local path="`echo $full_path | cut -d? -f1`"
  local query="`echo $full_path | grep ? | cut -d? -f2`"
  local -i rc=0
  
  [ -n "$proto" ] && eval "export ${prefix}_SCHEME=\"$scheme\"" || rc=$?
  [ -n "$user" ] && eval "export ${prefix}_USER=\"`urldecode $user`\"" || rc=$?
  [ -n "$pass" ] && eval "export ${prefix}_PASSWORD=\"`urldecode $pass`\"" || rc=$?
  [ -n "$host" ] && eval "export ${prefix}_HOST=\"`urldecode $host`\"" || rc=$?
  [ -n "$port" ] && eval "export ${prefix}_PORT=\"`urldecode $port`\"" || rc=$?
  [ -n "$path" ] && eval "export ${prefix}_NAME=\"`urldecode $path`\"" || rc=$?
  [ -n "$query" ] && eval "export ${prefix}_QUERY=\"$query\"" || rc=$?
}

download_mysql_driver() {
  local driver="mysql-connector-java-5.1.30"
  if [ ! -f "$1/$driver-bin.jar" ]; then
    echo "Downloading MySQL JDBC Driver..."
    curl -L http://dev.mysql.com/get/Downloads/Connector-J/$driver.tar.gz | tar zxv -C /tmp
    cp /tmp/$driver/$driver-bin.jar $1/$driver-bin.jar
  fi
}

if [ -n "$DATABASE_URL" ]; then
  unset DB_PORT
  parse_url "$DATABASE_URL" DB
  case "$DB_SCHEME" in
    postgres|postgresql)
      if [ -z "$DB_PORT" ]; then
        DB_PORT=5432
      fi
      DB_JDBC_DRIVER="org.postgresql.Driver"
      DB_JDBC_URL="jdbc:postgresql://$DB_HOST:$DB_PORT/$DB_NAME"
      ;;
    mysql|mysql2)
      download_mysql_driver /opt/stash/lib
      if [ -z "$B_PORT" ]; then
        DB_PORT=3306
      fi
      DB_JDBC_DRIVER="com.mysql.jdbc.Driver"
      DB_JDBC_URL="jdbc:mysql://$DB_HOST:$DB_PORT/$DB_NAME?characterEncoding=utf8&useUnicode=true&sessionVariables=storage_engine%3DInnoDB"
      ;;
    *)
      echo "Unsupported database url scheme: $DB_SCHEME"
      exit 1
      ;;
  esac
  cat << EOF > /opt/stash-home/stash-config.properties
#>*******************************************************
#> Migrated to database at $DB_JDBC_URL
#> Generated by launch script on `date`
#>*******************************************************
jdbc.driver=$DB_JDBC_DRIVER
jdbc.url=$DB_JDBC_URL
jdbc.user=$DB_USER
jdbc.password=$DB_PASSWORD
EOF

fi

/opt/stash/bin/start-stash.sh -fg