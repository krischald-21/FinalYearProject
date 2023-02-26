# importing necessary libraries
import requests
import csv
from bs4 import BeautifulSoup

# initializing URLS for web scraping
itti_url = input("Enter Itti URL: ")


def itti_laptops():
    try:
        # initializing empty dictionary to store laptop details
        laptops = {}
        response = requests.get(itti_url)
        # parsing content of the request page using beautiful soup
        soup = BeautifulSoup(response.content, "html.parser")
        # finding all the laptops in the webpage
        laptop = soup.find("div", class_="col2-layout")
        # getting necessary information from the webpage
        name = laptop.find("span", class_="base").text.strip()
        all_name = name.split()
        description = laptop.find("p").text.strip()
        brand = all_name[0]
        price = laptop.find("span", class_="price").text.strip()
        # adding laptop's details into dictionary
        laptops["productName"] = name
        laptops["productBrand"] = brand
        laptops["productDescription"] = description
        laptops["productCategory"] = "laptop"

        return laptops
    except:
        return "NA"

# main method


def main():
    # getting laptop details
    product_det = itti_laptops()
    # opening csv file to store laptop details using csv
    file = open('products.csv', 'a')
    writer = csv.DictWriter(file, fieldnames=list(product_det.keys()))
    writer.writerow(product_det)
    file.close()


main()
