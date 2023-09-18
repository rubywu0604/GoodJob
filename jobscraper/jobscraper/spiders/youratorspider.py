import scrapy


class YouratorspiderSpider(scrapy.Spider):
    name = "youratorspider"
    allowed_domains = ["www.yourator.co"]
    start_urls = ["https://www.yourator.co/jobs?sort=most_related"]

    def parse(self, response):
        pass
