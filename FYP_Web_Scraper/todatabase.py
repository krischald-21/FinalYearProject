import pandas as pd
import pyodbc

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


def main():
    add_to_stores()
    add_to_products()
    add_to_storeProducts()


main()

# close database connection
conn.close()
