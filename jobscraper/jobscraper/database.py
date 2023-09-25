from dotenv import load_dotenv
import pymysql
import os


class DatabaseRDS:
    def __init__(self):
        load_dotenv()
        self.RDS_HOST = os.getenv("RDS_HOSTNAME")
        self.RDS_PORT = "3306"
        self.RDS_USER = os.getenv("RDS_USERNAME")
        self.RDS_PASSWORD = os.getenv("RDS_PASSWORD")
        self.RDS_DATABASE = os.getenv("RDS_DATABASE")

        try:
            self.conn = pymysql.connect(
                host=self.RDS_HOST,
                port=self.RDS_PORT,
                user=self.RDS_USER,
                password=self.RDS_PASSWORD,
                database=self.RDS_DATABASE,
            )
            self.cur = self.conn.cursor()
            print("Connected to Database RDS.")

        except pymysql.Error as e:
            print("Error connecting to RDS:", e)
            self.conn = None

    def execute(self, sql, values=None):
        try:
            self.cur.execute(sql, values)
            return self.cur
        except pymysql.Error as e:
            print("Error executing RDS mysql statement:", e)
            return None

    def executemany(self, sql, values=None):
        try:
            self.cur.executemany(sql, values)
            return self.cur
        except pymysql.Error as e:
            print("Error executing RDS mysql statement:", e)
            return None

    def commit(self):
        return self.conn.commit()
    
    def delete(self):
        delete_query = "DELETE FROM job WHERE id > 0"
        self.execute(delete_query)
        self.commit()

    def reset_auto_increment(self):
        reset_auto_increment_query = "ALTER TABLE job AUTO_INCREMENT = 1"
        self.execute(reset_auto_increment_query)
        self.commit()

    def close(self):
        self.cur.close()
        self.conn.close()