# Models for  scraped items
#
# Documentation info:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class JobscraperItem(scrapy.Item):
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
