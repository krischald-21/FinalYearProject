import requests
from bs4 import BeautifulSoup

# scrape data from https://itti.com.np/laptops-by-brands/dell
url1 = "https://itti.com.np/laptops-by-brands/dell"
response1 = requests.get(url1)
soup1 = BeautifulSoup(response1.content, "html.parser")
products1 = soup1.find_all("div", class_="product-item-info")

# scrape data from https://www.sastodeal.com/electronic/laptops/dell.html
url2 = "https://www.sastodeal.com/electronic/laptops/dell.html"
response2 = requests.get(url2)
soup2 = BeautifulSoup(response2.content, "html.parser")
products2 = soup2.find_all("div", class_="product-item-details")
# create dictionaries to store the data
data1 = {}
data2 = {}

# extract data from https://itti.com.np
for product in products1:
    name = product.find("a", class_="product-item-link").text.strip()
    price = product.find("span", class_="price").text.strip()
    data1[name] = price

# extract data from https://www.sastodeal.com
for product in products2:
    try:
        name = product.find("a", class_="product-item-link").text.strip()
        price = product.find("span", class_="price").text.strip()
        data2[name] = price
    except:
        break

# compare prices of the same products
for name in data1:
    if name in data2:
        print("Product:", name)
        print("Price on itti.com.np:", data1[name])
        print("Price on sastodeal.com:", data2[name])
        print()


# from sklearn.feature_extraction.text import CountVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# from bs4 import BeautifulSoup
# import requests

# itti_url = 'https://itti.com.np/gaming-laptops-nepal'
# ptech_url = 'https://ptechktm.com/buy-gaming-laptop-nepal'


# def itti_laptops():
#     try:
#         itti_dict = []
#         response = requests.get(itti_url)
#         soup = BeautifulSoup(response.content, "html.parser")
#         laptops = soup.find_all("div", class_="product-item-info")

#         for laptop in laptops:
#             list_items = {}
#             name = laptop.find("a", class_="product-item-link").text.strip()
#             price = laptop.find("span", class_="price").text.strip()
#             list_items['name'] = name
#             list_items['price'] = price
#             itti_dict.append(list_items)
#         print(itti_dict)
#     except:
#         return


# itti_laptops()

# string1 = "hello world"
# string2 = "world hello"

# # create a CountVectorizer object to convert the strings to vectors of word frequencies
# vectorizer = CountVectorizer().fit_transform([string1, string2])

# # calculate the cosine similarity of the vectors
# similarity = cosine_similarity(vectorizer)[0][1]

# print("Cosine similarity:", similarity)


# # importing necessary libraries
# import requests
# import csv
# from bs4 import BeautifulSoup

# # initializing URLS for web scraping
# # itti_url = input("Enter Itti URL: ")


# # def itti_laptops():
# #     try:
# #         # initializing empty dictionary to store laptop details
# #         laptops = {}
# #         response = requests.get(itti_url)
# #         # parsing content of the request page using beautiful soup
# #         soup = BeautifulSoup(response.content, "html.parser")
# #         # finding all the laptops in the webpage
# #         laptop = soup.find("div", class_="col2-layout")
# #         # getting necessary information from the webpage
# #         name = laptop.find("span", class_="base").text.strip()
# #         all_name = name.split()
# #         description = laptop.find("p").text.strip()
# #         brand = all_name[0]
# #         price = laptop.find("span", class_="price").text.strip()
# #         # adding laptop's details into dictionary
# #         laptops["productName"] = name
# #         laptops["productBrand"] = brand
# #         laptops["productDescription"] = description
# #         laptops["productCategory"] = "laptop"

# #         return laptops
# #     except:
# #         return "NA"

# # # main method


# # def main():
# #     # getting laptop details
# #     product_det = itti_laptops()
# #     # opening csv file to store laptop details using csv
# #     file = open('products.csv', 'a')
# #     writer = csv.DictWriter(file, fieldnames=list(product_det.keys()))
# #     writer.writerow(product_det)
# #     file.close()


# # main()


# sd_url = "https://www.sastodeal.com/electronic/laptops.html"
# ptech_url = "https://ptechktm.com/buy-laptop-nepal"


# def sasto_deal_laptops():
#     try:
#         response = requests.get(sd_url)

#         # Parsing the HTML content of the requested webpage using Beautiful Soup
#         soup = BeautifulSoup(response.content, "html.parser")

#         # Finding all the laptops in the webpage
#         laptop_list = soup.find_all("div", class_="product-item-details")

#         # Extracting necessary information for price comparison
#         for laptop in laptop_list:
#             name = laptop.find("a", class_="product-item-link").text.strip()
#             price = laptop.find("span", class_="price").text.strip()

#             print(f"Name: {name}")
#             print(f"Price: {price}")
#             print()
#     except:
#         return


# def ptech_laptops():
#     try:
#         response = requests.get(ptech_url)
#         soup = BeautifulSoup(response.content, "html.parser")

#         laptops = soup.find_all("div", class_="images-container")

#         for laptop in laptops:
#             name = laptop.find("a", class_="product-item-link").text.strip()
#             price = laptop.find("span", class_="price").text.strip()
#             print(f"Name: {name}")
#             print(f"Price: {price}")
#             print()

#     except:
#         return
