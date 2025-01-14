import mysql.connector
import datetime as dt

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="password",
  database = "finance"
)

mycursor = mydb.cursor()

mycursor.execute("select * from expenses")