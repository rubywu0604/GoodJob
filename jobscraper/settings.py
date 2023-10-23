# Scrapy settings for jobscraper project
import datetime
import os
from dotenv import load_dotenv


load_dotenv()

BOT_NAME = "jobscraper"
SPIDER_MODULES = ["jobscraper.spiders"]
NEWSPIDER_MODULE = "jobscraper.spiders"
SCRAPEOPS_API_KEY = os.getenv('SCRAPEOPS_API_KEY')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

today = datetime.datetime.today()

FEEDS = {
   f'backupdata{today.strftime("%Y/%m-%d")}.json': {'format': 'json'},
   f's3://project-goodjob/{today.strftime("%Y-%m-%d")}/%(name)s_%(time)s.jsonl': {
      'format': 'jsonlines',
      'store_empty': False,
      'encoding': 'utf8', 
   }
}

ROBOTSTXT_OBEY = False
CONCURRENT_REQUESTS = 32
DOWNLOAD_DELAY = 0.5
CONCURRENT_REQUESTS_PER_DOMAIN = 16

DOWNLOADER_MIDDLEWARES = {
   "scrapeops_scrapy.middleware.retry.RetryMiddleware": 550,
   "scrapy.downloadermiddlewares.retry.RetryMiddleware": None,
}

EXTENSIONS = {
   "scrapeops_scrapy.extension.ScrapeOpsMonitor": 500,
   "scrapy.extensions.feedexport": None,
}

ITEM_PIPELINES = {
   "jobscraper.pipelines.JobscraperPipeline": 300
}

ITEM_ADAPTER = 'jobscraper.adapters.CustomItemAdapter'

HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 86400
HTTPCACHE_DIR = "httpcache"

REQUEST_FINGERPRINTER_IMPLEMENTATION = "2.7"
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"

# Documentation info:
#
#     https://docs.scrapy.org/en/latest/topics/settings.html
#     https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://docs.scrapy.org/en/latest/topics/spider-middleware.html