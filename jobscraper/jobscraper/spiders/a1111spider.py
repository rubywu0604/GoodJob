import scrapy


class A1111spiderSpider(scrapy.Spider):
    name = "1111spider"
    allowed_domains = ["www.1111.com.tw"]
    start_urls = ["https://www.1111.com.tw/search/job"]

    def parse(self, response):
        pass
