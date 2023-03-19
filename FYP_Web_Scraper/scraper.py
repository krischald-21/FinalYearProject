import time
import csv
import os.path
from selenium import webdriver
from bs4 import BeautifulSoup
from strsimpy.jaro_winkler import JaroWinkler
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from difflib import SequenceMatcher

# initializing normalized jaro_winkler object
jaro_winkler = JaroWinkler()

# set up the Chrome daraz_driver
daraz_driver = webdriver.Chrome()
itti_driver = webdriver.Chrome()
sasto_driver = webdriver.Chrome()

# Name of the CSV file
filename = 'laptops.csv'

# navigate to the website
daraz_url = 'https://www.daraz.com.np/laptops/dell/?spm=a2a0e.11779170.cate_5_4.2.287d2d2b8zLTJj'
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


def create_ngrams(text, n):
    """Create n-grams of a string."""
    # Replace / and - characters with spaces
    text = text.replace('/', ' ').replace('-', ' ')

    # Convert the text to lowercase and remove any non-alphabetic characters
    text = ''.join(c.lower() for c in text if c.isalpha() or c.isspace())

    # Split the text into words
    words = text.split()

    # Create the n-grams
    ngrams = []
    for i in range(len(words) - n + 1):
        ngrams.append(' '.join(words[i:i+n]))

    return ngrams


def get_daraz_data():
    # get the HTML content of the page
    html = daraz_driver.page_source

    # create a BeautifulSoup object
    soup = BeautifulSoup(html, 'html.parser')

    # find all the laptops on the page
    laptops = soup.find_all('div', {'class': 'box--pRqdD'})

    for i in range(5):
        # Scroll down the page
        ActionChains(daraz_driver).move_to_element(
            daraz_driver.find_element(By.TAG_NAME, 'body')).send_keys(Keys.PAGE_DOWN).perform()
        time.sleep(1)

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
        store_img_link = 'https://superdesk-pro-c.s3.amazonaws.com/sd-nepalitimes/20221109141144/636baf8d9c7e80680e078059png.png'
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
    for i in range(5):
        # Scroll down the page
        ActionChains(itti_driver).move_to_element(
            itti_driver.find_element(By.TAG_NAME, 'body')).send_keys(Keys.PAGE_DOWN).perform()
        time.sleep(1)

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

    for i in range(5):
        # Scroll down the page
        ActionChains(sasto_driver).move_to_element(
            sasto_driver.find_element(By.TAG_NAME, 'body')).send_keys(Keys.PAGE_DOWN).perform()
        time.sleep(1)

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
            store_img_link = 'https://s3-us-west-2.amazonaws.com/cbi-image-service-prd/modified/6267e600-c16f-4a47-8be1-c2e511ae0498.png'
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


def string_similarity(string1, string2):
    """Calculate the similarity between two strings in a list of strings."""
    # Calculate the similarity between the two strings at indices i and j
    matcher = SequenceMatcher(None, string1, string2)
    similarity = matcher.ratio()

    return similarity


def similar_names():
    # Calculate similarity between each pair of names in the list
    for i in range(len(all_laptops)):
        for j in range(i+1, len(all_laptops)):
            name1 = all_laptops[i]['name']
            name2 = all_laptops[j]['name']
            store1 = all_laptops[i]['store']
            store2 = all_laptops[j]['store']
            if store1 != store2:
                similarity_score = string_similarity(name1, name2)
                if similarity_score > 0.95:
                    # Rename the second laptop to have the same name as the first
                    all_laptops[j]['name'] = name1


def add_to_csv(fname):
    # Check if file exists
    print('abc')
    file_exists = os.path.isfile(fname)

    # Write data to CSV file
    with open(fname, 'a', newline='', encoding="utf-8") as csvfile:
        # use keys from first dictionary as fieldnames
        fieldnames = all_laptops[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()  # write header row if file did not exist

        for row in all_laptops:
            writer.writerow(row)  # write each row of data


def scrape():
    # scraping data
    get_daraz_data()
    get_itti_data()
    get_sasto_data()

    # standardizing names
    similar_names()

    add_to_csv(filename)

    name_dict = {}

    for laptop in all_laptops:
        name = laptop['name']
        store = laptop['store']
        if name in name_dict:
            name_dict[name].append(store)
        else:
            name_dict[name] = [store]

    for name, stores in name_dict.items():
        if len(stores) > 1:
            print("Name: " + name + ", Stores: " + ", ".join(stores))


scrape()

# close the Chrome daraz_driver
daraz_driver.quit()
itti_driver.quit()
sasto_driver.quit()

# # write the laptop data to a CSV file
# with open('daraz_laptop_data.csv', 'w', newline='') as file:
#     writer = csv.DictWriter(file, fieldnames=daraz_laptop_data[0].keys
