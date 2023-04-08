import pandas as pd
import pyodbc
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# set up connection to SQL Server database
conn = pyodbc.connect('Driver={SQL Server};'
                      'Server=IUSETHISPC;'
                      'Database=FYP_DB;'
                      'Trusted_Connection=yes;')

# read CSV file into a pandas DataFrame
df = pd.read_csv('laptops.csv')


def add_to_stores():
    # extract unique values in store and storeImgLink columns
    stores = df['store'].unique()
    store_img_links = df['storeImgLink'].unique()

    # iterate over unique stores and storeImgLink values and insert into database
    cursor = conn.cursor()
    for store, store_img_link in zip(stores, store_img_links):
        # check if store already exists in database
        query = "SELECT storeId FROM stores WHERE storeName = ?"
        cursor.execute(query, store)
        result = cursor.fetchone()
        if result:
            # store already exists, skip insertion
            continue
        # store does not exist, insert into database
        query = "INSERT INTO stores (storeName, imgLink) VALUES (?, ?)"
        cursor.execute(query, store, store_img_link)
        conn.commit()


def add_to_products():
    # extract unique values in name column
    unique_names = df['name'].unique()

    # iterate over unique names and insert into database
    cursor = conn.cursor()
    for name in unique_names:
        # check if product already exists in database
        query = "SELECT productId FROM products WHERE productName = ?"
        cursor.execute(query, name)
        result = cursor.fetchone()
        if result:
            # product already exists, skip insertion
            continue
        # product does not exist, insert into database
        # get the index of the first occurrence of the product name in the CSV file
        index = df.loc[df['name'] == name].index[0]
        # insert the product into the database
        product_query = "INSERT INTO products (productName, productBrand, imgLink) VALUES (?, ?, ?)"
        cursor.execute(product_query, name,
                       df.loc[index, 'brand'], df.loc[index, 'imgLink'])
        conn.commit()


def add_to_storeProducts():
    # iterate over each row in the DataFrame and insert or update data in the storeProducts table
    cursor = conn.cursor()
    for i, row in df.iterrows():
        # get the store ID from the stores table
        store_query = "SELECT storeId FROM stores WHERE storeName = ?"
        cursor.execute(store_query, row['store'])
        store_id = cursor.fetchone()[0]

        # get the product ID from the products table
        product_query = "SELECT productId FROM products WHERE productName = ?"
        cursor.execute(product_query, row['name'])
        product_result = cursor.fetchone()
        if product_result:
            product_id = product_result[0]
        else:
            # product not found in database, skip this row
            continue

        # check if record already exists in the storeProducts table
        check_query = "SELECT price FROM storeProducts WHERE productLink = ?"
        cursor.execute(check_query, row['productLink'])
        result = cursor.fetchone()
        if result:
            # if record already exists, check if price has changed
            if result[0] != row['price']:
                if row['price'] < result[0]:
                    priceDropAlert(row['productLink'], row['name'],
                                   result[0], row['price'], row['store'])
                # price has changed, update record
                update_query = "UPDATE storeProducts SET price = ? WHERE productLink = ?"
                cursor.execute(update_query, row['price'], row['productLink'])
                conn.commit()
        else:
            # if record does not exist, insert new record
            store_product_query = "INSERT INTO storeProducts (storeId, productId, price, productLink) VALUES (?, ?, ?, ?)"
            cursor.execute(store_product_query, store_id,
                           product_id, row['price'], row['productLink'])
            conn.commit()


# Initialize set for alerted productIds
processed_product_id = set()

# function to handle price drop alert


def priceDropAlert(productLink, name, priceBefore, priceAfter, store):
    is_alerted = already_alerted(productLink)
    if is_alerted:
        return
    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()

    # Execute a SELECT query to retrieve the userId values for the given productLink
    query = """
        SELECT DISTINCT pd.userId
        FROM priceDrop pd
        JOIN storeProducts sp ON sp.productId = pd.productId
        WHERE sp.productLink = ?
    """
    cursor.execute(query, (productLink,))

    # Fetch the results and extract the userId values
    results = cursor.fetchall()

    # Store the unique user ids in a list
    user_ids = []
    for row in results:
        user_id = row[0]
        if user_id not in user_ids:
            user_ids.append(user_id)

    # Loop over the user ids and send an email to each user's email address
    for user_id in user_ids:
        print(productLink)
        # Get the user's email address from the users table
        email_query = "select userEmail from users where userId = ?"
        cursor.execute(email_query, (user_id,))
        email_result = cursor.fetchone()
        email_address = email_result[0] if email_result else None

        # Call the send_email function to send an email to the user's email address
        if email_address:
            send_email(email_address, productLink, name,
                       priceBefore, priceAfter, store)


def already_alerted(product_link):
    # Set up SQL query
    sql_query = 'SELECT DISTINCT pd.productId FROM priceDrop pd JOIN storeProducts sp ON sp.productId = pd.productId WHERE sp.productLink = ?'

    # Execute SQL query and retrieve results
    cursor = conn.cursor()
    cursor.execute(sql_query, product_link)
    rows = cursor.fetchall()

    # Process results and extract unique product IDs
    for row in rows:
        alerted_id = row.productId
        if alerted_id in processed_product_id:
            return True
        processed_product_id.add(alerted_id)
    return False


def send_email(email_address, productLink, name, priceBefore, priceAfter, store):
    # Set up the SMTP server connection
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'krischald21@gmail.com'
    smtp_password = 'gbyurkwkxhwnvoru'
    smtp_connection = smtplib.SMTP(smtp_server, smtp_port)
    smtp_connection.starttls()
    smtp_connection.login(smtp_username, smtp_password)

    # Create the email message
    from_address = smtp_username
    to_address = email_address
    subject = 'Price Drop Alert!'
    body = f'The price of "{name}" has dropped from Rs.{format(int(priceBefore), ",d")} to Rs.{format(int(priceAfter), ",d")} in {store} !!\nClick the link below to view the page where the price has dropped\n\n{productLink}'
    message = MIMEMultipart()
    message['From'] = from_address
    message['To'] = to_address
    message['Subject'] = subject
    message.attach(MIMEText(body, 'plain'))

    # Send the email
    smtp_connection.sendmail(from_address, to_address, message.as_string())

    # Close the SMTP connection
    smtp_connection.quit()


def main():
    # add_to_stores()
    # add_to_products()
    add_to_storeProducts()


main()

# close database connection
conn.close()
