import scrapy
import re


class A104spiderSpider(scrapy.Spider):
    name = "104spider"
    allowed_domains = ["www.104.com.tw"]

    def start_urls():
        job_types = ["ios", "android", "frontend", "backend", "data_engineer", "data_analyst", "data_scientist", "dba"]
        start_urls = []
        for job_type in job_types:
            for p in range(1, 51):
                url = f"https://www.104.com.tw/jobs/search/?keyword={job_type}&page={p}"
                start_urls.append(url)
        return start_urls
    
    start_urls = start_urls()

    def parse(self, response):
        keyword = re.search(r'keyword=(\w+)', response.url).group(1)
        jobs = response.css('article.job-list-item')

        for job in jobs:
            job_title = job.css('h2 a::text, h2 em::text').getall()
            job_title = ''.join(job_title).strip()
            lastupdate = job.css('h2 span.b-tit__date::text').get().strip()
            if "/" in lastupdate:
                yield{
                    'category': keyword,
                    'job_title': job_title,
                    'location': job.css('ul.job-list-intro li:nth-child(1)::text').get(),
                    'lastupdate': lastupdate,
                    'company': job.css('li:nth-child(2) a::text').get().strip().replace('\n', ''),
                    'salary': job.css('div.job-list-tag a:nth-child(1)::text').get(),
                    'education': job.css('ul.job-list-intro li:nth-child(5)::text').get(),
                    'experience': job.css('ul.job-list-intro li:nth-child(3)::text').get(),
                    'job_link': 'https:' + job.css('h2 a::attr(href)').get()
                }

            