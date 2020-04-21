import psycopg2
import psycopg2.extras
import os


def connect():
    # setup connection string
    # to do this, please define these environment variables first
    user_name = os.environ.get('PSQL_USER_NAME')
    password = os.environ.get('PSQL_PASSWORD')
    host = os.environ.get('PSQL_HOST')
    database_name = os.environ.get('PSQL_DB_NAME')
    try:
        connection = psycopg2.connect(
            user=user_name,
            password=password,
            host=host,
            database=database_name,
            port=5432
        )
        connection.autocommit = True
    except psycopg2.DatabaseError as exception:
        raise exception
    return connection


def use(function):
    def wrapper(*args, **kwargs):
        connection = connect()
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        data = function(cursor, *args, **kwargs)
        cursor.close()
        connection.close()
        return data

    return wrapper
