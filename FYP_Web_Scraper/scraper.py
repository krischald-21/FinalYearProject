from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_distances
import time
import csv
import os.path
from selenium import webdriver
from bs4 import BeautifulSoup

# set up the Chrome daraz_driver
daraz_driver = webdriver.Chrome()
itti_driver = webdriver.Chrome()
sasto_driver = webdriver.Chrome()

# Name of the CSV file
filename = 'laptops.csv'

# navigate to the website
daraz_url = 'https://www.daraz.com.np/dell/?from=filter&q=laptops'
daraz_driver.get(daraz_url)

itti_url = 'https://itti.com.np/laptops-by-brands/dell'
itti_driver.get(itti_url)

sasto_url = 'https://www.sastodeal.com/electronic/laptops/dell.html'
sasto_driver.get(sasto_url)
time.sleep(3)

# create an empty list to store the laptop data
all_laptops = []
daraz_laptop_data = []
itti_laptop_data = []
sasto_laptop_data = []


def get_daraz_data():
    # get the HTML content of the page
    html = daraz_driver.page_source

    # create a BeautifulSoup object
    soup = BeautifulSoup(html, 'html.parser')

    # find all the laptops on the page
    laptops = soup.find_all('div', {'class': 'box--pRqdD'})

    # loop through each laptop and extract its data
    for laptop in laptops:
        # extract the laptop data from the product page
        name_element = laptop.find(
            'div', {'class': 'title--wFj93'})
        name = name_element.find('a').text.strip().lower().replace('\n', ' ')
        product_link = name_element.find('a').get('href')
        price = float(laptop.find(
            'span', {'class': 'currency--GVKjl'}).text.strip().replace(',', '').replace('Rs. ', ''))
        brand = name.split()[0]
        store = 'daraz'
        img_element = laptop.find('div', {'class': 'img--VQr82'})
        img = img_element.find('img')
        img_link = img.get('src')
        store_img_link = 'https://www.daraz.com.np/products/lenovo-legion-5-ryzen-5-4600h-gtx-1650ti-8gb-ram-256gb-ssd-1tb-hdd-156-120hz-display-i118886063-s1032553910.html?spm=a2a0e.searchlist.list.6.38126940J490bI&search=1'
        # click on the laptop to open its product page
        # link_div = laptop.find('div', {'class': 'title--wFj93'})
        # laptop_link = link_div.find('a').get('href')
        # daraz_driver.get('https:'+laptop_link)

        # get the HTML content of the product page
        # html = daraz_driver.page_source

        # # create a BeautifulSoup object for the product page
        # soup = BeautifulSoup(html, 'html.parser')

        # specs = soup.find_all('li', {'class': 'key-li'})
        # display_size = 'Not Available'
        # processor = 'Not Available'
        # ram = 'Not Available'

        # for spec in specs:
        #     spec_title = spec.find('span').text.strip().lower()
        #     spec_value = spec.find('div').text.strip().lower()
        #     if spec_title == 'brand':
        #         brand = spec_value
        #     elif spec_title == 'display size':
        #         display_size = spec_value.replace(' inch', '')
        #     elif spec_title == 'ram memory':
        #         ram = spec_value.replace('gb', '')
        #     elif spec_title == 'processor':
        #         processor = spec_value

        daraz_laptop_data.append({
            'name': name,
            'brand': brand,
            'price': price,
            'store': store,
            'imgLink': img_link,
            'productLink': product_link,
            'storeImgLink': store_img_link
        })
        all_laptops.append({
            'name': name,
            'brand': brand,
            'price': price,
            'store': 'daraz',
            'imgLink': img_link,
            'productLink': product_link,
            'storeImgLink': store_img_link
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
        # extract the laptop data from the product page
        name = laptop.find(
            'a', {'class': 'product-item-link'}).text.strip().lower().replace('\n', ' ')
        product_link = laptop.find(
            'a', {'class': 'product-item-link'}).get('href')
        price_element = laptop.find('span', {'data-price-type': 'finalPrice'})
        price = float(price_element.find(
            'span', {'class': 'price'}).text.strip().replace(',', '').replace('NPR', ''))
        brand = name.split()[0]
        store = 'itti'
        img_element = laptop.find('span', {'class': 'product-image-wrapper'})
        img = img_element.find('img')
        img_link = img.get('src')
        store_img_link = 'https://itti.com.np/lenovo-legion-5-ryzen-5-price-nepal'
        # click on the laptop to open its product page
        # laptop_link = laptop.find(
        #     'a', {'class': 'product-item-link'}).get('href')
        # itti_driver.get(laptop_link)
        # time.sleep(3)

        # get the HTML content of the product page
        # html = itti_driver.page_source

        # # create a BeautifulSoup object for the product page
        # soup = BeautifulSoup(html, 'html.parser')

        # specs = soup.find_all('tr')
        # brand = name.split()[0]
        # display_size = 'Not Available'
        # processor = 'Not Available'
        # ram = 'Not Available'

        # for spec in specs:
        #     spec_title = spec.select('tr > td')[0].get_text(strip=True).lower()
        #     try:
        #         spec_value = spec.find('span').text.strip()
        #     except:
        #         spec_value = 'NA'
        #     if spec_title == 'cpu':
        #         processor = spec_value
        #     elif spec_title == 'display':
        #         display_size = spec_value
        #     elif spec_title == 'memory':
        #         ram = spec_value

        itti_laptop_data.append({
            'name': name,
            'brand': brand,
            'price': price,
            'store': store,
            'imgLink': img_link,
            'productLink': product_link,
            'storeImgLink': store_img_link
        })
        all_laptops.append({
            'name': name,
            'brand': brand,
            'price': price,
            'store': store,
            'imgLink': img_link,
            'productLink': product_link,
            'storeImgLink': store_img_link
        })


def get_sasto_data():
    # get the HTML content of the page
    html = sasto_driver.page_source

    # create a BeautifulSoup object
    soup = BeautifulSoup(html, 'html.parser')

    # find all the laptops on the page
    laptops = soup.find_all('div', {'class': 'product-item-info'})

    # loop through each laptop and extract its data
    for laptop in laptops:
        try:
            # extract the laptop data from the product page
            name = laptop.find(
                'a', {'class': 'product-item-link'}).text.strip().lower().replace('\n', ' ')
            product_link = laptop.find(
                'a', {'class': 'product-item-link'}).get('href')
            price_element = laptop.find(
                'span', {'data-price-type': 'finalPrice'})
            price = float(price_element.find(
                'span', {'class': 'price'}).text.strip().replace(',', '').replace('रू ', ''))
            brand = name.split()[0]
            store = 'sasto deal'
            img_element = laptop.find(
                'span', {'class': 'product-image-wrapper'})
            img = img_element.find('img')
            img_link = img.get('src')
            store_img_link = 'https://www.sastodeal.com/lenovo-legion-5-ryzen-7-5800h-rtx-3050ti-8gb-ram-512gb-ssd-15-6-fhd-display-tech-store-0147852.html'
            # click on the laptop to open its product page
            # laptop_link = laptop.find(
            #     'a', {'class': 'product-item-link'}).get('href')
            # sasto_driver.get(laptop_link)
            # time.sleep(3)

            # # get the HTML content of the product page
            # html = sasto_driver.page_source

            # # create a BeautifulSoup object for the product page
            # soup = BeautifulSoup(html, 'html.parser')

            # specs = soup.find_all('tr')
            # display_size = 'Not Available'
            # processor = 'Not Available'
            # ram = 'Not Available'

            # for spec in specs:
            #     spec_title = spec.select('tr > td')[
            #         0].get_text(strip=True).lower()
            #     try:
            #         spec_value = spec.select('tr > td')[
            #             1].get_text(strip=True).lower()
            #     except:
            #         spec_value = 'NA'
            #     if spec_title == 'processor' or spec_title == 'cpu':
            #         processor = spec_value
            #     elif spec_title == 'display size' or spec_title == 'display':
            #         display_size = spec_value
            #     elif spec_title == 'ram' or spec_title == 'memory':
            #         ram = spec_value

            sasto_laptop_data.append({
                'name': name,
                'brand': brand,
                'price': price,
                'store': store,
                'imgLink': img_link,
                'productLink': product_link,
                'storeImgLink': store_img_link
            })
            all_laptops.append({
                'name': name,
                'brand': brand,
                'price': price,
                'store': 'sastodeal',
                'imgLink': img_link,
                'productLink': product_link,
                'storeImgLink': store_img_link
            })
        except:
            break


def main():
    get_daraz_data()
    get_itti_data()
    get_sasto_data()

    # Check if file exists
    file_exists = os.path.isfile(filename)

    # Write data to CSV file
    with open(filename, 'a', newline='', encoding="utf-8") as csvfile:
        # use keys from first dictionary as fieldnames
        fieldnames = all_laptops[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()  # write header row if file did not exist

        for row in all_laptops:
            writer.writerow(row)  # write each row of data


main()

# close the Chrome daraz_driver
daraz_driver.quit()
itti_driver.quit()
sasto_driver.quit()

# # write the laptop data to a CSV file
# with open('daraz_laptop_data.csv', 'w', newline='') as file:
#     writer = csv.DictWriter(file, fieldnames=daraz_laptop_data[0].keys
