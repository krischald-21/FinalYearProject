import time
import csv
from selenium import webdriver
from bs4 import BeautifulSoup

# set up the Chrome daraz_driver
daraz_driver = webdriver.Chrome()
itti_driver = webdriver.Chrome()

# navigate to the website
daraz_url = 'https://www.daraz.com.np/dell/?from=filter&q=laptops'
daraz_driver.get(daraz_url)

itti_url = 'https://itti.com.np/laptops-by-brands/dell'
itti_driver.get(itti_url)
time.sleep(3)

# create an empty list to store the laptop data
all_laptops = []
daraz_laptop_data = []
itti_laptop_data = []


def get_daraz_data():
    # get the HTML content of the page
    html = daraz_driver.page_source

    # create a BeautifulSoup object
    soup = BeautifulSoup(html, 'html.parser')

    # find all the laptops on the page
    laptops = soup.find_all('div', {'class': 'box--pRqdD'})

    # loop through each laptop and extract its data
    for laptop in laptops:
        # click on the laptop to open its product page
        link_div = laptop.find('div', {'class': 'title--wFj93'})
        laptop_link = link_div.find('a').get('href')
        print(laptop_link)
        daraz_driver.get('https:'+laptop_link)
        time.sleep(3)

        # get the HTML content of the product page
        html = daraz_driver.page_source

        # create a BeautifulSoup object for the product page
        soup = BeautifulSoup(html, 'html.parser')

        # extract the laptop data from the product page
        name = soup.find(
            'span', {'class': 'pdp-mod-product-badge-title'}).text.strip().lower()
        price = float(soup.find(
            'span', {'class': 'pdp-price'}).text.strip().replace(',', '').replace('Rs', '').replace('. ', ''))

        specs = soup.find_all('li', {'class': 'key-li'})
        brand = None
        display_size = None
        processor = None
        ram = None

        for spec in specs:
            spec_title = spec.find('span').text.strip().lower()
            spec_value = spec.find('div').text.strip().lower()
            if spec_title == 'brand':
                brand = spec_value
            elif spec_title == 'display size':
                display_size = spec_value.replace(' inch', '')
            elif spec_title == 'ram memory':
                ram = spec_value.replace('gb', '')
            elif spec_title == 'processor':
                processor = spec_value

        daraz_laptop_data.append({
            'name': name,
            'brand': brand,
            'price': price,
            'display_size': display_size,
            'processor': processor,
            'ram': ram
        })
        all_laptops.append({
            'name': name,
            'brand': brand,
            'price': price,
            'display_size': display_size,
            'processor': processor,
            'ram': ram
        })


def get_itti_data():
    # get the HTML content of the page
    html = itti_driver.page_source

    # create a BeautifulSoup object
    soup = BeautifulSoup(html, 'html.parser')

    # find all the laptops on the page
    laptops = soup.find_all('div', {'class': 'product-item-info'})

    # loop through each laptop and extract its data
    for laptop in laptops:
        # click on the laptop to open its product page
        laptop_link = laptop.find(
            'a', {'class': 'product-item-link'}).get('href')
        itti_driver.get(laptop_link)
        time.sleep(3)

        # get the HTML content of the product page
        html = itti_driver.page_source

        # create a BeautifulSoup object for the product page
        soup = BeautifulSoup(html, 'html.parser')

        # extract the laptop data from the product page
        name = soup.find(
            'h1', {'class': 'page-title'}).text.strip().lower()
        price = float(soup.find(
            'span', {'class': 'price'}).text.strip().replace(',', '').replace('NPR', ''))

        specs = soup.find_all('tr')
        brand = name.split()[0]
        display_size = None
        processor = None
        ram = None

        for spec in specs:
            spec_title = spec.select('tr > td')[0].get_text(strip=True).lower()
            try:
                spec_value = spec.find('span').text.strip()
            except:
                spec_value = 'NA'
            if spec_title == 'cpu':
                processor = spec_value
            elif spec_title == 'display':
                display_size = spec_value
            elif spec_title == 'memory':
                ram = spec_value

        itti_laptop_data.append({
            'name': name,
            'brand': brand,
            'price': price,
            'display_size': display_size,
            'processor': processor,
            'ram': ram
        })
        all_laptops.append({
            'name': name,
            'brand': brand,
            'price': price,
            'display_size': display_size,
            'processor': processor,
            'ram': ram
        })


# close the Chrome daraz_driver
daraz_driver.quit()
itti_driver.quit()

# # write the laptop data to a CSV file
# with open('daraz_laptop_data.csv', 'w', newline='') as file:
#     writer = csv.DictWriter(file, fieldnames=daraz_laptop_data[0].keys
