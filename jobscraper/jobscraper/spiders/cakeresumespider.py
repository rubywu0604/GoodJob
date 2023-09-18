import scrapy


class CakeresumespiderSpider(scrapy.Spider):
    name = "cakeresumespider"
    allowed_domains = ["www.cakeresume.com"]
    start_urls = ["https://www.cakeresume.com/jobs/"]

    def parse(self, response):
        pass
