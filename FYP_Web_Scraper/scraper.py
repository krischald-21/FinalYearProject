import requests
from bs4 import BeautifulSoup

# initializing URLS for web scraping
itti_url = input("Enter Itti URL: ")


def itti_laptops():
    try:
        response = requests.get(itti_url)
        soup = BeautifulSoup(response.content, "html.parser")

        laptops = soup.find_all("div", class_="col2-layout")

        for laptop in laptops:
            name = laptop.find("span", class_="base").text.strip()
            all_name = name.split()
            brand = all_name[0]
            price = laptop.find("span", class_="price").text.strip()
            print(f"Name: {name}")
            print(f"Brand: {brand}")
            print(f"Price: {price}")
            print()

    except:
        return


itti_laptops()
