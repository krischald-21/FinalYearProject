# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# import pandas as pd


# # set up the drivers
# daraz_driver = webdriver.Chrome()
# itti_driver = webdriver.Chrome()
# sasto_driver = webdriver.Chrome()
# daraz_wait = WebDriverWait(daraz_driver, 10)
# itti_wait = WebDriverWait(itti_driver, 10)
# sasto_wait = WebDriverWait(sasto_driver, 10)

# # navigate to the Lenovo laptops pages on all three websites
# daraz_url = 'https://www.daraz.com.np/lenovo/?from=filter&q=laptops'
# daraz_driver.get(daraz_url)

# itti_url = 'https://itti.com.np/laptops-by-brands/lenovo-laptops-nepal'
# itti_driver.get(itti_url)

# sasto_url = 'https://www.sastodeal.com/electronic/laptops/lenovo.html'
# sasto_driver.get(sasto_url)

# # wait for the listings to load on all three websites
# daraz_listings = daraz_wait.until(EC.presence_of_all_elements_located(
#     (By.XPATH, '//div[@data-qa-locator="product-item"]')))
# itti_listings = itti_wait.until(EC.presence_of_all_elements_located(
#     (By.XPATH, '//div[@class="product-item-info"]')))
# sasto_listings = sasto_wait.until(EC.presence_of_all_elements_located(
#     (By.XPATH, '//div[@class="product-item-info"]')))

# # extract information from each listing on all three websites
# daraz_products = {}
# itti_products = {}
# sasto_products = {}

# all_laptops = []

# for listing in daraz_listings:
#     # extract the product name
#     name_element = listing.find_element(
#         'xpath', './/div[@class="title--wFj93"]/a')
#     name = name_element.text

#     brand_element = name.split()
#     brand = brand_element[0]

#     # extract the product price
#     price_element = listing.find_element(
#         'xpath', './/div[@class="price--NVB62"]/span')
#     price = price_element.text

#     # add the product to the dictionary
#     daraz_products[name] = {
#         'brand': brand,
#         'description': name,
#         'category': brand,
#     }

# for listing in itti_listings:
#     # extract the product name
#     name_element = listing.find_element(
#         'xpath', './/a[@class="product-item-link"]')
#     name = name_element.text

#     brand_element = name.split()
#     brand = brand_element[0]

#     # extract the product price
#     price_element = listing.find_element(
#         'xpath', './/span[@data-price-type="finalPrice"]/span')
#     price = price_element.text

#     # add the product to the dictionary
#     itti_products[name] = {
#         'brand': brand,
#         'description': name,
#         'category': brand,
#     }

# for listing in sasto_listings:
#     try:
#        # extract the product name
#         name_element = listing.find_element(
#             'xpath', './/a[@class="product-item-link"]')
#         name = name_element.text

#         brand_element = name.split()
#         brand = brand_element[0]

#         # extract the product price
#         price_element = listing.find_element(
#             'xpath', './/span[@class="price"]')
#         price = price_element.text

#         # add the product to the dictionary
#         sasto_products[name] = {
#             'brand': brand,
#             'description': name,
#             'category': brand,
#         }
#     except:
#         break


# unique_laptops = set()
# for i in daraz_products:
#     unique_laptops.add(i.lower())
# for i in itti_products:
#     unique_laptops.add(i.lower())
# for i in sasto_products:
#     unique_laptops.add(i.lower())

# print(unique_laptops)
# print(len(unique_laptops))

# # from selenium import webdriver
# # from selenium.webdriver.common.by import By
# # from selenium.webdriver.support.ui import WebDriverWait
# # from selenium.webdriver.support import expected_conditions as EC

# # # set up the driver
# # driver = webdriver.Chrome(
# #     'C:/Users/krisc/Downloads/Compressed/chromedriver_win32/chromedriver')
# # wait = WebDriverWait(driver, 10)

# # # navigate to the Lenovo laptops page on daraz.com.np
# # url = 'https://www.daraz.com.np/lenovo/?from=filter&q=laptops'
# # driver.get(url)

# # # wait for the listings to load
# # listings = wait.until(EC.presence_of_all_elements_located(
# #     (By.XPATH, '//div[@data-qa-locator="product-item"]')))

# # # extract information from each listing
# # for listing in listings:
# #     # extract the product name
# #     name_element = listing.find_element(
# #         'xpath', './/div[@class="title--wFj93"]/a')
# #     name = name_element.text

# #     # extract the product price
# #     price_element = listing.find_element(
# #         'xpath', './/div[@class="price--NVB62"]/span')
# #     price = price_element.text

# #     # print the information
# #     print(f'Name: {name}')
# #     print(f'Price: {price}')
# #    #  print(f'Rating: {rating}')
# #     print()

# # # close the driver
# # driver.quit()
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_distances
from strsimpy.jaro_winkler import JaroWinkler
from strsimpy.jaccard import Jaccard
from difflib import SequenceMatcher


def string_similarity(string1, string2):
    """Calculate the similarity between two strings in a list of strings."""
    # Calculate the similarity between the two strings at indices i and j
    matcher = SequenceMatcher(None, string1, string2)
    similarity = matcher.ratio()

    return similarity


texts = ["The quick brown fox jumps over the lazy dog",
         "The brown fox jumps over the lazy dog",
         "The quick red fox jumps over the lazy dog"]

for i in range(len(texts)):
    for j in range(i+1, len(texts)):
        similarity = string_similarity(texts[i], texts[j])
        print(similarity)


# for i in daraz:
#     for j in itti:
#         cosine_d = cosine_distance_calc('dell', 'dell')
#         if(cosine_d <= 0.3):
#             j['name'] = i['name']

# print(itti)
# similarity_scores = []
# for i in range(len(list1)):
#     scores = []
#     for j in range(len(list1)):
#         score = levenshtein.similarity(list1[i], list1[j])
#         scores.append(score)
#     similarity_scores.append(scores)

# # Print the similarity scores
# for i, item1 in enumerate(list1):
#     for j, item2 in enumerate(list1):
#         score = similarity_scores[i][j]
#         print(item1)
#         print(item2)
#         print(score)
#         print()
