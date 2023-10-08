# import datetime
# from jobscraper.spiders.a104spider import A104spiderSpider
# from jobscraper.spiders.a1111spider import A1111spiderSpider
# from jobscraper.spiders.a518spider import A518spiderSpider
# from scrapy.crawler import CrawlerProcess
# from scrapy.utils.project import get_project_settings


# settings = get_project_settings()

# today = datetime.datetime.today() 
# settings.update({
#     'FEEDS': {
#         f'backupdata{today.strftime("%Y/%m-%d")}.json': {'format': 'json'},
#     }
# })
# process = CrawlerProcess(settings)
# process.crawl(A104spiderSpider)
# process.crawl(A1111spiderSpider)
# process.crawl(A518spiderSpider)
# process.start()