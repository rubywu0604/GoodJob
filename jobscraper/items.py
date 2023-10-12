# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class JobscraperItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    category = scrapy.Field()
    job_title = scrapy.Field()
    location = scrapy.Field()
    company = scrapy.Field()
    min_monthly_salary = scrapy.Field()
    max_monthly_salary = scrapy.Field()
    education = scrapy.Field()
    experience = scrapy.Field()
    job_link = scrapy.Field()
    skills = scrapy.Field()
    source_website = scrapy.Field()
